import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerExecutorController } from './volunteer-executor.controller';

describe('VolunteerExecutorController', () => {
  let controller: VolunteerExecutorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VolunteerExecutorController],
    }).compile();

    controller = module.get<VolunteerExecutorController>(VolunteerExecutorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
