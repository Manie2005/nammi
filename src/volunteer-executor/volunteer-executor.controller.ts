import { Controller, Post, Param, Request, UseGuards } from '@nestjs/common';
import { VolunteerExecutorService } from './volunteer-executor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtUser } from 'src/auth/jwt-user.interface';
// ✅ Define a custom User type that matches JwtStrategy's return object
interface AuthenticatedRequest extends Request{
    user:JwtUser;
}

@Controller('volunteer-executor')
export class VolunteerExecutorController {
    constructor(private readonly volunteerExecutorService: VolunteerExecutorService) {}

    @UseGuards(JwtAuthGuard)
    @Post('/apply/:taskId')
    async applyForTask(@Param('taskId') taskId: number, @Request() req) {
        console.log('🔍 Incoming Request User:', req.user); // Debug log
    
        return await this.volunteerExecutorService.applyTask(taskId, req.user.userId);
    }
    
}
