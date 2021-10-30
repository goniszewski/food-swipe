import { PartialType } from '@nestjs/mapped-types';
import { CreateDataFetcherDto } from './create-data-fetcher.dto';

export class UpdateDataFetcherDto extends PartialType(CreateDataFetcherDto) {}
