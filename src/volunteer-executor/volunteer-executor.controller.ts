import { Controller, Post, Param, Req, UseGuards } from '@nestjs/common';
import { VolunteerExecutorService } from './volunteer-executor.service';
import { Request } from 'express';
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
    @Post('apply/:taskId')
    async applyTask(@Param('taskId') taskId: number, @Req() req: Request & { user: JwtUser }) { // ✅ Type req.user explicitly
        const userId = req.user.userId; // ✅ Now TypeScript knows userId exists
        return this.volunteerExecutorService.applyTask(taskId, userId);
    }
}
