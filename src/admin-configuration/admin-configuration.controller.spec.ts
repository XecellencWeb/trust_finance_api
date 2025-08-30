import { Test, TestingModule } from '@nestjs/testing';
import { AdminConfigurationController } from './admin-configuration.controller';

describe('AdminConfigurationController', () => {
  let controller: AdminConfigurationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminConfigurationController],
    }).compile();

    controller = module.get<AdminConfigurationController>(AdminConfigurationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
