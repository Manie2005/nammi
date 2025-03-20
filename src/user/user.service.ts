import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole, User } from 'src/entity/user.entity';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/dto/login.dto';
import * as bcrypt from 'bcrypt';
import * as admin from 'firebase-admin';
import * as ethUtil from 'ethereumjs-util';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    async createuser(email: string, walletAddress: string, password: string, role: UserRole) {
        if (await this.userRepository.findOne({ where: { email } })) {
            throw new BadRequestException('This email address is already registered');
        }

        if (await this.userRepository.findOne({ where: { walletAddress } })) {
            throw new BadRequestException('This wallet address is already registered');
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = this.userRepository.create({
            email,
            walletAddress,
            password: hashedPassword,
            role
        });

        await this.userRepository.save(user);

        console.log(`✅ New user created: ID=${user.id}, Role=${user.role}`);

        return this.generateTokens(user);
    }

    async login(loginDto: LoginDto): Promise<any> {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Invalid credentials');
        }

        console.log(`✅ Logging in user: ID=${user.id}, Role=${user.role}`);
        return this.generateTokens(user);
    }

    async googleLogin(profile: any): Promise<any> {
        if (!profile) throw new BadRequestException('Google authentication failed');

        let user = await this.userRepository.findOne({ where: { email: profile.emails[0].value } });

        if (!user) {
            user = this.userRepository.create({
                email: profile.emails[0].value,
                googleId: profile.id,
                role: user.role, 
                isVerified: true, // Google accounts are assumed verified
            });

            await this.userRepository.save(user);
            console.log(`✅ New Google user created: ID=${user.id}, Email=${user.email}`);
        }

        return this.generateTokens(user);
    }

    async appleLogin(idToken: string): Promise<any> {
        if (!idToken) throw new BadRequestException('Apple ID token is required');

        try {
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            
            if (!decodedToken) throw new BadRequestException('Invalid Apple ID token');

            const email = decodedToken.email;
            const uid = decodedToken.uid;

            let user = await this.userRepository.findOne({ where: { email } });

            if (!user) {
                user = this.userRepository.create({
                    email,
                    appleId: uid,
                    role: user.role, 
                    isVerified: true, 
                });

                await this.userRepository.save(user);
                console.log(`✅ New Apple user created: ID=${user.id}, Email=${user.email}`);
            }

            return this.generateTokens(user);
        } catch (error) {
            console.error('🔥 Apple Sign-In Error:', error.message);
            throw new BadRequestException('Apple authentication failed');
        }
    }

    async verifyOtp(email: string, otpCode: string): Promise<{ success: boolean; message: string }> {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) throw new BadRequestException('User not found');
        if (!user.otpCode || !user.otpExpires) throw new BadRequestException('No OTP generated for this user');
        if (new Date() > user.otpExpires) throw new BadRequestException('OTP has expired');
        if (user.otpCode !== otpCode) throw new BadRequestException('Invalid OTP code');

        user.isVerified = true;
        user.otpCode = null;
        user.otpExpires = null;
        await this.userRepository.save(user);

        return { success: true, message: 'OTP verified successfully' };
    }

    async walletLogin(walletAddress: string, signedMessage: string): Promise<any> {
        if (!walletAddress || !signedMessage) {
            throw new BadRequestException('Wallet address and signed message are required');
        }

        // The message that was signed (frontend should send the exact message it signed)
        const message = `Sign this message to authenticate. Timestamp: ${Date.now()}`;
        const msgBuffer = Buffer.from(message, 'utf8');
        const msgHash = ethUtil.hashPersonalMessage(msgBuffer);

        try {
            // Extract signature parameters
            const signatureParams = ethUtil.fromRpcSig(signedMessage);
            const publicKey = ethUtil.ecrecover(msgHash, signatureParams.v, signatureParams.r, signatureParams.s);
            const recoveredAddress = ethUtil.bufferToHex(ethUtil.pubToAddress(publicKey));

            if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
                throw new BadRequestException('Invalid signature');
            }

            let user = await this.userRepository.findOne({ where: { walletAddress } });

            if (!user) {
                user = this.userRepository.create({ walletAddress, role:user.role });
                await this.userRepository.save(user);
            }

            return this.generateTokens(user);
        } catch (error) {
            throw new BadRequestException('Signature verification failed');
        }
    }
    async logout(userId: string): Promise<{ success: boolean; message: string }> {
        const user = await this.userRepository.findOne({ where: { id: Number(userId) } });
        if (!user) {
            throw new BadRequestException('User not found');
        }

        // Clear the refresh token from the database
        user.refreshToken = null;
        await this.userRepository.save(user);

        return { success: true, message: 'User logged out successfully' };
    }

    private async generateTokens(user: User) {
        const payload = { userId: user.id, role: user.role, walletAddress: user.walletAddress };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' });

        user.refreshToken = refreshToken;
        await this.userRepository.save(user);

        return {
            success: true,
            message: 'Authentication successful',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                walletAddress: user.walletAddress
            }
        }
    }
}
