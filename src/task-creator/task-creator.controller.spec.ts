import { Test, TestingModule } from '@nestjs/testing';
import { TaskCreatorController } from './task-creator.controller';

describe('TaskCreatorController', () => {
  let controller: TaskCreatorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskCreatorController],
    }).compile();

    controller = module.get<TaskCreatorController>(TaskCreatorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
