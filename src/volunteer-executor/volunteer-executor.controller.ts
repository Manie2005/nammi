import { Body, Controller, Post } from '@nestjs/common';
import { VolunteerExecutorService } from './volunteer-executor.service';

@Controller('volunteer-executor')
export class VolunteerExecutorController {
    constructor(private readonly volunteerExecutorService: VolunteerExecutorService) {}

    @Post('apply')
    async applyTask(
        @Body('taskId') taskId: number,
        @Body('userId') userId: number,
        @Body('description') description: string,
        @Body('payment') payment: number,
    ) {
        return this.volunteerExecutorService.applyTask(taskId, userId, description, payment);
    }
}