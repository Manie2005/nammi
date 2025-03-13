import { Test, TestingModule } from '@nestjs/testing';
import { TaskCreatorService } from './task-creator.service';

describe('TaskCreatorService', () => {
  let service: TaskCreatorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TaskCreatorService],
    }).compile();

    service = module.get<TaskCreatorService>(TaskCreatorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
