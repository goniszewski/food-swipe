import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DataFetcherService } from './data-fetcher.service';
import { CreateDataFetcherDto } from './dto/create-data-fetcher.dto';
import { UpdateDataFetcherDto } from './dto/update-data-fetcher.dto';

@Controller('data-fetcher')
export class DataFetcherController {
  constructor(private readonly dataFetcherService: DataFetcherService) {}

  @Post()
  create(@Body() createDataFetcherDto: CreateDataFetcherDto) {
    return this.dataFetcherService.create(createDataFetcherDto);
  }

  @Get('fetch/:from')
  async fetch(@Param('from') from: string, @Query('q') query: string) {
    return this.dataFetcherService.fetchFrom(from, query);
  }
}
