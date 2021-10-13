import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './modules/category/category.module';
import { IngredientModule } from './modules/ingredient/ingredient.module';
import { ItemModule } from './modules/item/item.module';
import { RecipeModule } from './modules/recipe/recipe.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get(
          'MONGODB_USER',
        )}:${configService.get(
          'MONGODB_PASSWORD',
        )}@localhost:27017/${configService.get(
          'MONGODB_DBNAME',
        )}?authSource=admin`,
        autoCreate: true,
      }),
      inject: [ConfigService],
    }),
    RecipeModule,
    IngredientModule,
    ItemModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
