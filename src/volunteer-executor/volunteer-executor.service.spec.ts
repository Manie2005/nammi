import { Test, TestingModule } from '@nestjs/testing';
import { VolunteerExecutorService } from './volunteer-executor.service';

describe('VolunteerExecutorService', () => {
  let service: VolunteerExecutorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VolunteerExecutorService],
    }).compile();

    service = module.get<VolunteerExecutorService>(VolunteerExecutorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
