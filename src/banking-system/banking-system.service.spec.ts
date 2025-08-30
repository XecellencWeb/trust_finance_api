import { Test, TestingModule } from '@nestjs/testing';
import { BankingSystemService } from './banking-system.service';

describe('BankingSystemService', () => {
  let service: BankingSystemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankingSystemService],
    }).compile();

    service = module.get<BankingSystemService>(BankingSystemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
