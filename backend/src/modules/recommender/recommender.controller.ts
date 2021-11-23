import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RecommenderService } from './recommender.service';

@Controller('recommender')
@UseGuards(AuthGuard('jwt'))
export class RecommenderController {
  constructor(private readonly recommenderService: RecommenderService) {}
}
