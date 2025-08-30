import { Test, TestingModule } from '@nestjs/testing';
import { CryptoDepositsController } from './crypto-deposits.controller';

describe('CryptoDepositsController', () => {
  let controller: CryptoDepositsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoDepositsController],
    }).compile();

    controller = module.get<CryptoDepositsController>(CryptoDepositsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
