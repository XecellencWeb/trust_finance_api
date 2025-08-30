import { Test, TestingModule } from '@nestjs/testing';
import { BankingSystemController } from './banking-system.controller';

describe('BankingSystemController', () => {
  let controller: BankingSystemController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BankingSystemController],
    }).compile();

    controller = module.get<BankingSystemController>(BankingSystemController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
