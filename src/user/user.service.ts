import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole, User } from 'src/entity/user.entity';
import { LoginDto } from 'src/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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

        const payload = { userId: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' });

        user.refreshToken = refreshToken;
        await this.userRepository.save(user);

        return {
            success: true,
            message: 'User registered successfully',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }

    async login(loginDto: LoginDto): Promise<any> {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Invalid credentials');
        }

        console.log(`✅ Logging in user: ID=${user.id}, Role=${user.role}`);

        const payload = { userId: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' });

        user.refreshToken = refreshToken;
        await this.userRepository.save(user);

        return {
            success: true,
            message: 'User logged in successfully',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }
    async verifyOtp(email:string, otpCode: string): Promise<{ success: boolean; message: string }> {
        const user = await this.userRepository.findOne({ where: { email} });
    
        if (!user) {
            throw new BadRequestException('User not found');
        }
    
        if (!user.otpCode || !user.otpExpires) {
            throw new BadRequestException('No OTP generated for this user');
        }
    
        // Check if OTP is expired
        if (new Date() > user.otpExpires) {
            throw new BadRequestException('OTP has expired');
        }
    
        // Validate OTP
        if (user.otpCode !== otpCode) {
            throw new BadRequestException('Invalid OTP code');
        }
    
        // Mark user as verified
        user.isVerified = true;
        user.otpCode = null;
        user.otpExpires = null;
        await this.userRepository.save(user);
    
        return { success: true, message: 'OTP verified successfully' };
    }
    
}
