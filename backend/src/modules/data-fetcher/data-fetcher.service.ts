import { HttpService } from '@nestjs/axios';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RecipeService } from '../recipe/recipe.service';
import { CreateDataFetcherDto } from './dto/create-data-fetcher.dto';
import { UpdateDataFetcherDto } from './dto/update-data-fetcher.dto';
import edamamSerializer from '../../shared/serializers/Edamam';
import { lastValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DataFetcherService {
  constructor(
    private recipeService: RecipeService,
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}
  sources = {
    edamam: { url: this.configService.get('EDAMAM_URL') },
  };

  create(createDataFetcherDto: CreateDataFetcherDto) {
    return 'This action adds a new dataFetcher';
  }

  async fetchFrom(from: string, query: string) {
    console.log({
      from,
      query,
      '`${sources[from].url}?q=${query}`': `${this.sources[from].url}&q=${query}`,
    });
    const responseRaw = await lastValueFrom(
      this.httpService.get(`${this.sources[from].url}&q=${query}`),
    );
    console.log({ responseRaw });
    const recipesData = await edamamSerializer(responseRaw.data);

    // if (!recipesData) {
    //   throw new NotFoundException();
    // }

    const recipes = await Promise.all(
      recipesData.map(async (recipe) => this.recipeService.create(recipe)),
    );

    return recipes;
  }
}
