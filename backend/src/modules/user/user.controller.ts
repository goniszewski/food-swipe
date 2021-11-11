import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

import { User } from './entities/user.schema';
import ArrayPagination from 'src/shared/interfaces/array-pagination.interface';
import { AddUserRecipeInteractionDto } from './dto/add-user-recipe-interaction.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('choices')
  async addChoice(@Request() req, @Body() body) {
    const { id: userId }: Partial<User> = req.user;
    const { recipeId, timestamp, source } = body;

    return this.userService.addChoice({ userId, recipeId, timestamp, source });
  }

  @Patch('favourites')
  async addFavorite(@Request() req, @Body() body) {
    const { id: userId }: Partial<User> = req.user;
    const {
      recipeId,
      timestamp,
      source,
    }: Omit<AddUserRecipeInteractionDto, 'userId'> = body;

    return this.userService.addFavoriteRecipe({
      userId,
      recipeId,
      timestamp,
      source,
    });
  }

  @Patch('recommendations')
  async addRecommendations(
    @Request() req,
    @Body() { recommendationIds }: { recommendationIds: string[] },
  ) {
    const { id: userId }: Partial<User> = req.user;
    return this.userService.addRecommendations(userId, recommendationIds);
  }

  @Get('choices')
  async getChoices(@Request() req, @Param() pagination: ArrayPagination) {
    const { id: userId }: Partial<User> = req.user;

    return this.userService.getChoices(userId, pagination);
  }

  @Get('favourites')
  async getFavoriteRecipes(
    @Request() req,
    @Param() pagination: ArrayPagination,
  ) {
    const { id: userId }: Partial<User> = req.user;

    return this.userService.getFavoriteRecipes(userId, pagination);
  }

  @Get('recommendations')
  async getRecommendations(
    @Param('id') id: string,
    @Param() pagination: ArrayPagination,
  ) {
    return this.userService.getRecommendations(id, pagination);
  }

  @Get('login/:login')
  async findByLogin(@Param('login') login: string) {
    return this.userService.findByLogin(login);
  }

  @Delete('recommendations/:recipeId')
  async removeRecommendation(
    @Param('recipeId') recipeId: string,
    @Request() req,
  ) {
    const { id: userId }: Partial<User> = req.user;

    return this.userService.removeRecommendation(userId, recipeId);
  }

  @Delete('favourite/:recipeId')
  async removeFavorite(@Request() req, @Param('recipeId') recipeId) {
    const { id: userId }: Partial<User> = req.user;

    return this.userService.removeFavoriteRecipe(userId, recipeId);
  }

  @Get()
  async getUser(@Request() req) {
    return req.user;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
