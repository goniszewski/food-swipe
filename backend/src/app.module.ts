/* eslint-disable @typescript-eslint/no-var-requires */
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CategoryModule } from './modules/category/category.module';
import { DataFetcherModule } from './modules/data-fetcher/data-fetcher.module';
import { ItemModule } from './modules/item/item.module';
import { RecipeModule } from './modules/recipe/recipe.module';
import { RecommenderModule } from './modules/recommender/recommender.module';
import { UserModule } from './modules/user/user.module';

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
        connectionFactory: (connection) => {
          connection.plugin(require('mongoose-autopopulate'));
          connection.plugin(require('@abhisekp/mongoose-to-json'));
          return connection;
        },
      }),
      inject: [ConfigService],
    }),
    RecipeModule,
    ItemModule,
    CategoryModule,
    UserModule,
    DataFetcherModule,
    AuthModule,
    RecommenderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
