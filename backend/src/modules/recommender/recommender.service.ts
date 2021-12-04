import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { PersonalizeClient } from '@aws-sdk/client-personalize';
import {
  PersonalizeEventsClient,
  PutEventsCommand,
  PutItemsCommand,
  PutUsersCommand,
} from '@aws-sdk/client-personalize-events';
import { Recipe, RecipeDocument } from '../recipe/entities/recipe.schema';
import { RecommenderRecipe } from './models/recommender-recipe';
import { chunk } from 'src/shared/utils/utils';
import { UserDocument } from '../user/entities/user.schema';
import {
  UserRecipeInteraction,
  UserRecipeInteractionDocument,
} from '../user/entities/user-recipe-interaction.schema';
import { RecommenderChoice } from './models/recommender-choice';
import { RecommenderUser } from './models/recommender-user';
import { Credentials } from 'aws-sdk';

const S3_KEY_PREFIX = 'personalize/csv';
const S3_KEY_SUFFIX = '.csv';

@Injectable()
export class RecommenderService {
  private s3Client: S3Client;
  private personalizeClient: PersonalizeClient;
  private personalizeEventsClient: PersonalizeEventsClient;
  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get('PERSONALIZE_REGION'),
      credentials: new Credentials({
        accessKeyId: configService.get('PERSONALIZE_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('PERSONALIZE_SECRET_ACCESS_KEY'),
      }),
    });
    // this.personalizeClient = new PersonalizeClient({
    //   region: configService.get('PERSONALIZE_REGION'),
    //   credentials: new Credentials({
    //     accessKeyId: configService.get('PERSONALIZE_ACCESS_KEY_ID'),
    //     secretAccessKey: configService.get('PERSONALIZE_SECRET_ACCESS_KEY'),
    //   }),
    // });
    this.personalizeEventsClient = new PersonalizeEventsClient({
      region: configService.get('PERSONALIZE_REGION'),
      credentials: new Credentials({
        accessKeyId: configService.get('PERSONALIZE_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('PERSONALIZE_SECRET_ACCESS_KEY'),
      }),
    });
  }

  public uploadCSV = async ({
    data,
    fileName,
  }: {
    data: string;
    fileName: string;
  }) => {
    try {
      const fileKey = `${S3_KEY_PREFIX}/${Date.now()}_${fileName}${S3_KEY_SUFFIX}`;

      return this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.configService.get('S3_BUCKET'),
          Key: fileKey,
          Body: data,
        }),
      );
    } catch (e) {
      throw new Error(`Error when uploading buffer: ${e?.message}`);
    }
  };

  async generateCSV(data: Object | Object[]): Promise<string> {
    const stringify = require('csv-stringify');
    return new Promise((resolve, reject) => {
      stringify(
        data,
        {
          header: true,
          cast: {
            boolean: (value: boolean) => (value ? 'true' : 'false'),
            object: (value: any[]) => (value ? value.join('|') : 'null'),
            number: (value: any) => (value ? `${value}` : 'null'),
            string: (value: any) => (value ? value : 'null'),
            date: (value: Date) =>
              value ? Math.round(value.getTime() / 1000).toString() : 'null',
          },
        },
        (err: any, output: string) => {
          if (err) {
            reject(err);
          }
          resolve(output);
        },
      );
    });
  }

  async generateUsersCSV(usersData: UserDocument[]) {
    const userObjects = usersData.map((user) => user.toJSON());

    const users: RecommenderUser[] = userObjects.map((user) => ({
      USER_ID: user.id as unknown as string,
      VEGAN: user.defaultVegan,
      VEGETARIAN: user.defaultVegetarian,
    }));

    return this.generateCSV(users);
  }

  async generateRecipesCSV(recipesData: RecipeDocument[]): Promise<string> {
    const recipeObjects = recipesData.map(
      (recipe) => recipe.toJSON() as unknown as Recipe,
    );

    const recipes: RecommenderRecipe[] = recipeObjects.map(
      (recipe: Recipe) => ({
        ITEM_ID: recipe.id,
        // CALORIES_PER_SERVING: recipe.caloriesPerServing,
        PREPARATION_TIME: recipe.preparationTime,
        // DESCRIPTION: recipe.description,
        INGREDIENTS: recipe.ingredients.map(
          (ingredient) => ingredient.item.name,
        ),
        CATEGORIES: recipe.categories.map((category) => category.name),
        TAGS: recipe.tags,
        VEGAN: recipe.isVegan,
        VEGETARIAN: recipe.isVegetarian,
        GLUTEN_FREE: recipe.isGlutenFree,
        AUTHOR: recipe.author,
      }),
    );

    return this.generateCSV(recipes);
  }

  async generateChoicesCSV(choicesData: UserRecipeInteractionDocument[]) {
    const choices = choicesData.map(
      (interaction) => interaction.toJSON() as unknown as UserRecipeInteraction,
    );

    const interactions: RecommenderChoice[] = choices.map(
      (interaction: UserRecipeInteraction) => ({
        USER_ID: interaction.user.id,
        ITEM_ID: interaction.recipe.id,
        TIMESTAMP: interaction.timestamp,
        EVENT_TYPE: interaction.eventType,
        SOURCE: interaction.source,
      }),
    );

    return this.generateCSV(interactions);
  }

  async sendRecipes(recipesData: RecipeDocument[]) {
    const itemsData = recipesData.map((recipe) => {
      let properties = {
        // servings: recipe.servings,
        // caloriesPerServing: recipe.caloriesPerServing,
        preparationTime: recipe.preparationTime,
        // description: recipe.description,
        ingredients: recipe.ingredients
          .map((ingredient) => ingredient.item.name)
          .join('|'),
        categories: recipe.categories
          .map((category) => category.name)
          .join('|'),
        tags: recipe.tags,
        vegan: recipe.isVegan,
        vegetarian: recipe.isVegetarian,
        glutenFree: recipe.isGlutenFree,
        author: recipe.author,
      };

      const propertiesLength = JSON.stringify(
        JSON.stringify(properties),
      ).length;

      if (propertiesLength > 1024) {
        console.info(
          `Recipe ${recipe.id} is too big to be sent to Personalize as is. Removing description.`,
        );

        // if (
        //   propertiesLength - JSON.stringify(properties.description).length <
        //   1024
        // ) {
        //   properties = {
        //     ...properties,
        //     description: '',
        //   };
        // } else {
        //   console.error(
        //     `Recipe ${recipe.id} cannot be sent to Personalize (too big).`,
        //   );
        //   return;
        // }
      }

      return {
        itemId: recipe.id,
        properties: JSON.stringify(properties),
      };
    });

    const chunkedItemsData = chunk(itemsData, 10);

    let awsResponses = [];

    try {
      chunkedItemsData.forEach(async (items: any[]) => {
        const putItemsCommand = new PutItemsCommand({
          datasetArn: this.configService.get('PERSONALIZE_RECIPE_DATASET_ARN'),
          items,
        });
        const awsResponse = await this.personalizeEventsClient.send(
          putItemsCommand,
        );

        awsResponses.push(awsResponse);
      });
    } catch (e) {
      console.error('Error while sending recipes to Personalize:', e?.message);
    }

    return awsResponses;
  }

  async sendRecipe(recipeData: RecipeDocument) {
    const recipe = recipeData.toJSON();

    let properties = {
      // servings: recipe.servings,
      // caloriesPerServing: recipe.caloriesPerServing,
      preparationTime: recipe.preparationTime,
      // description: recipe.description,
      ingredients: recipe.ingredients
        .map((ingredient) => ingredient.item.name)
        .join('|'),
      categories: recipe.categories.map((category) => category.name).join('|'),
      tags: recipe.tags,
      vegan: recipe.isVegan,
      vegetarian: recipe.isVegetarian,
      glutenFree: recipe.isGlutenFree,
      author: recipe.author,
    };

    const propertiesLength = JSON.stringify(JSON.stringify(properties)).length;

    if (propertiesLength > 1024) {
      console.info(
        `Recipe ${recipe.id} is too big to be sent to Personalize as is. Removing description.`,
      );

      // if (
      //   propertiesLength - JSON.stringify(properties.description).length <
      //   1024
      // ) {
      //   properties = {
      //     ...properties,
      //     description: '',
      //   };
      // } else {
      //   console.error(
      //     `Recipe ${recipe.id} cannot be sent to Personalize (too big).`,
      //   );
      //   return;
      // }
    }

    const putItemsCommand = new PutItemsCommand({
      datasetArn: this.configService.get('PERSONALIZE_RECIPE_DATASET_ARN'),
      items: [
        {
          itemId: recipe.id as unknown as string,
          properties: JSON.stringify(properties),
        },
      ],
    });
    const awsResponse = await this.personalizeEventsClient.send(
      putItemsCommand,
    );

    return awsResponse;
  }

  async sendUser(user: UserDocument) {
    const userObject = user.toJSON();

    const putUserCommand = new PutUsersCommand({
      datasetArn: this.configService.get('PERSONALIZE_USER_DATASET_ARN'),
      users: [
        {
          userId: userObject.id as unknown as string,
          properties: JSON.stringify({
            vegan: userObject.defaultVegan,
            vegetarian: userObject.defaultVegetarian,
          }),
        },
      ],
    });

    return this.personalizeEventsClient.send(putUserCommand);
  }

  async sendChoice(choice: UserRecipeInteractionDocument) {
    const choiceObject = choice.toJSON();

    const putEventCommand = new PutEventsCommand({
      userId: choiceObject.user.id,
      trackingId: this.configService.get('PERSONALIZE_EVENT_TRACKING_ID'),
      sessionId: (Date.now() / 100).toString(),
      eventList: [
        {
          eventType: choiceObject.eventType,
          itemId: choiceObject.recipe.id,
          sentAt: choiceObject.timestamp as unknown as Date,
          properties: JSON.stringify({
            source: choiceObject.source,
          }),
        },
      ],
    });

    return this.personalizeEventsClient.send(putEventCommand);
  }
}
