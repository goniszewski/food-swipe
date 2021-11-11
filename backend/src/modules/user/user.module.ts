import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { RecipeModule } from '../recipe/recipe.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './entities/user.schema';
import {
  UserRecipeInteraction,
  UserRecipeInteractionSchema,
} from './entities/user-recipe-interaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserRecipeInteraction.name, schema: UserRecipeInteractionSchema },
    ]),
    RecipeModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
