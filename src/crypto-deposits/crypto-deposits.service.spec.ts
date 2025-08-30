import { Test, TestingModule } from '@nestjs/testing';
import { CryptoDepositsService } from './crypto-deposits.service';

describe('CryptoDepositsService', () => {
  let service: CryptoDepositsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoDepositsService],
    }).compile();

    service = module.get<CryptoDepositsService>(CryptoDepositsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
