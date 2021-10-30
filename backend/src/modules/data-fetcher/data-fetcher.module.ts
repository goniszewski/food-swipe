import { Module } from '@nestjs/common';
import { DataFetcherService } from './data-fetcher.service';
import { DataFetcherController } from './data-fetcher.controller';
import { RecipeModule } from '../recipe/recipe.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [DataFetcherController],
  providers: [DataFetcherService],
  imports: [RecipeModule, HttpModule],
})
export class DataFetcherModule {}
