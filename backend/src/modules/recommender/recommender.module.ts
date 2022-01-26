import { Module } from '@nestjs/common';
import { RecommenderService } from './recommender.service';
import { RecommenderController } from './recommender.controller';

@Module({
  imports: [],
  providers: [RecommenderService],
  controllers: [RecommenderController],
  exports: [RecommenderService],
})
export class RecommenderModule {}
