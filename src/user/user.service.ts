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

    async logout(userId: string): Promise<{ success: boolean; message: string }> {
        const user = await this.userRepository.findOne({ where: { id: userId } });

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
        };
    }
}
