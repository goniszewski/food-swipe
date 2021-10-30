import { Test, TestingModule } from '@nestjs/testing';
import { DataFetcherService } from './data-fetcher.service';

describe('DataFetcherService', () => {
  let service: DataFetcherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataFetcherService],
    }).compile();

    service = module.get<DataFetcherService>(DataFetcherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
