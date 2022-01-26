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
import { UpdateUserPreferencesDto } from './dto/update-user-preferences.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Patch('preferences')
  async updatePreferences(
    @Request() req,
    @Body() body: UpdateUserPreferencesDto,
  ) {
    const { id: userId }: Partial<User> = req.user;
    return this.userService.updatePreferences(userId, body);
  }

  @Patch('choices')
  async addChoice(@Request() req, @Body() body) {
    const { id: userId }: Partial<User> = req.user;
    const { recipeId, timestamp, source } = body;

    return this.userService.addChoice({ userId, recipeId, timestamp, source });
  }

  @Post('generate-random-choices')
  async generateRandomChoices(
    @Body()
    { userIds, randomChoices }: { userIds: string[]; randomChoices: number },
  ) {
    return this.userService.generateRandomChoices(userIds, randomChoices);
  }

  @Get('generate-csv-of-all-choices')
  async generateCsvOfAllChoices() {
    return this.userService.generateCSVOfAllChoices();
  }

  @Get('generate-csv-of-all-users')
  async generateCsvOfAllUsers() {
    return this.userService.generateUsersCSV();
  }

  @Patch('favorites')
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

  @Get('favorites')
  async getFavoriteRecipes(
    @Request() req,
    @Param() pagination: ArrayPagination,
  ) {
    const { id: userId }: Partial<User> = req.user;

    return this.userService.getFavoriteRecipes(userId, pagination);
  }

  @Get('recommendations')
  async getRecommendations(
    @Param() pagination: ArrayPagination,
    @Request() req,
  ) {
    const { id: userId }: Partial<User> = req.user;

    console.log({ userId, pagination });

    return this.userService.getRecommendationsOrRandom(userId, pagination);
  }

  @Get('recommendations/update')
  async updateRecommendations(@Request() req) {
    const { id: userId }: Partial<User> = req.user;

    return this.userService.updateRecommendations(userId);
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

    console.log({ userId, recipeId });

    return this.userService.removeRecommendation(userId, recipeId);
  }

  @Delete('favorites/:recipeId')
  async removeFavorite(@Request() req, @Param('recipeId') recipeId) {
    const { id: userId }: Partial<User> = req.user;

    console.log({ userId, recipeId });

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
