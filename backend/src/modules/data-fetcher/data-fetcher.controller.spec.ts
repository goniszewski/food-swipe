import { Test, TestingModule } from '@nestjs/testing';
import { DataFetcherController } from './data-fetcher.controller';
import { DataFetcherService } from './data-fetcher.service';

describe('DataFetcherController', () => {
  let controller: DataFetcherController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataFetcherController],
      providers: [DataFetcherService],
    }).compile();

    controller = module.get<DataFetcherController>(DataFetcherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
