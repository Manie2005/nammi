import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRole, User } from 'src/entity/user.entity';
import { LoginDto } from 'src/dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { VerifyOtpDto } from 'src/dto/verify-otp.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        private readonly jwtService: JwtService
    ) {}

    // Generate a random 6-digit OTP
    private generateOtp(): string {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Send OTP via email
    private async sendEmail(to: string, subject: string, text: string) {
        const transporter = nodemailer.createTransport({
            service: 'gmail', // Change if using a different email provider
            auth: {
                user: 'fitfuelyt@gmail.com', // Replace with your email
                pass: 'aiha lvou hhpi lkxb',  // Use an app password for security
            },
        });

        const mailOptions = {
            from: 'fitfuelyt@gmail.com', // Replace with your email
            to,
            subject,
            text,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${to}`);
        } catch (error) {
            console.error('Error sending email:', error);
            throw new BadRequestException('Failed to send OTP. Please try again.');
        }
    }

    // Create User Function with OTP Email
    async createuser(email: string, walletAddress: string, password: string, role: UserRole) {
        // Check if email is already in use
        if (await this.userRepository.findOne({ where: { email } })) {
            throw new BadRequestException('This email address is already registered');
        }

        // Check if wallet address is already in use
        if (await this.userRepository.findOne({ where: { walletAddress } })) {
            throw new BadRequestException('This wallet address is already registered');
        }

        // Hash the password securely
        const hashedPassword = await bcrypt.hash(password, 12);

        // Generate OTP
        const otpCode = this.generateOtp();
        const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // OTP valid for 15 minutes

        // Create new user
        const user = this.userRepository.create({
            email,
            walletAddress,
            password: hashedPassword,
            role,
            otpCode,
            otpexpires: otpExpires,
        });

        // Save user to the database
        await this.userRepository.save(user);

        // Send OTP via email
        try {
            await this.sendEmail(email, 'Your OTP Code', `Your OTP is: ${otpCode}`);
        } catch (error) {
            throw new BadRequestException('Failed to send OTP email. Please try again.');
        }

        // Generate JWT tokens
        const payload = { userId: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' });

        // Store refresh token in the user entity
        user.refreshToken = refreshToken;

        return {
            success: true,
            message: 'OTP Code sent. Please check your email to verify your account.',
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
    
  // ✅ Verify OTP
  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<{ message: string }> {
    const { email, otpCode } = verifyOtpDto;
    const user = await this.userRepository.findOne({where:{email}});

    if (!user || user.otpCode !== otpCode.toString() || new Date(user.otpexpires) < new Date()) {
      throw new BadRequestException('Invalid or expired OTP');
    }

    user.otpCode = undefined;
    user.otpexpires = undefined;
    user.isVerified = true;

    await this.userRepository.save(user);
    return { message: 'Account successfully verified' };
  }

    // Login Function
    async login(loginDto: LoginDto): Promise<any> {
        const { email, password } = loginDto;

        // Find user by email
        const user = await this.userRepository.findOne({ where: { email } });

        // Validate credentials
        if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
            throw new BadRequestException('Invalid credentials');
        }

        // Generate tokens
        const payload = { userId: user.id, role: user.role };
        const accessToken = this.jwtService.sign(payload, { expiresIn: '15m' });
        const refreshToken = this.jwtService.sign(payload, { expiresIn: '14d' });

        // Store refresh token
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
                role: user.role,
            },
        };
    }
}
