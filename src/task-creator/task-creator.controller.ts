import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { TaskCreatorService } from './task-creator.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('task')
export class TaskCreatorController {
    constructor(private readonly taskCreatorService: TaskCreatorService) {}

    @Post('create')
    @UseGuards(AuthGuard('jwt')) // Protect endpoint
    async createTask(@Req() req, @Body() body) {
        const user = req.user; // Extract user from JWT
        return this.taskCreatorService.createTask(
            user.userId, // Ensure this is the ID extracted from JWT
            body.title,
            body.description,
            body.payment,
            body.executorsRequired,
            body.verifierRequired
        );
    }
}
