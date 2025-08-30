import { Test, TestingModule } from '@nestjs/testing';
import { AdminConfigurationService } from './admin-configuration.service';

describe('AdminConfigurationService', () => {
  let service: AdminConfigurationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminConfigurationService],
    }).compile();

    service = module.get<AdminConfigurationService>(AdminConfigurationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
