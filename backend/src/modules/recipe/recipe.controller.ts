import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  LinkHeaderInterceptor,
  MongoPaginationParamDecorator,
  MongoPagination,
} from '@algoan/nestjs-pagination';

import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('recipes')
export class RecipeController {
  constructor(private readonly recipeService: RecipeService) {}

  @Post()
  async create(@Body() createRecipeDto: CreateRecipeDto) {
    return this.recipeService.create(createRecipeDto);
  }

  @UseInterceptors(new LinkHeaderInterceptor({ resource: '' }))
  @Get()
  async findAll(@MongoPaginationParamDecorator() pagination: MongoPagination) {
    const paginatedData = await this.recipeService.findAll(pagination);

    return paginatedData;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.recipeService.findById(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
  ) {
    return this.recipeService.update(id, updateRecipeDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.recipeService.remove(id);
  }
}
