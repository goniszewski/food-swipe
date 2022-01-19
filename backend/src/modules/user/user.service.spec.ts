import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Allergens } from '../../shared/constants/allergens.enum';
import { RecipeService } from '../recipe/recipe.service';
import { Recipe, RecipeDocument } from '../recipe/entities/recipe.schema';
import { RecommenderService } from '../recommender/recommender.service';
import { UserService } from './user.service';
import { CategoryService } from '../category/category.service';
import { IngredientService } from '../ingredient/ingredient.service';
import { ItemService } from '../item/item.service';
import { ConfigService } from '@nestjs/config';
import { User, UserDocument } from './entities/user.schema';
import { Model, Document, Query } from 'mongoose';
import { createMock } from '@golevelup/ts-jest';
import { UserRecipeInteractionDocument } from './entities/user-recipe-interaction.schema';
import { CategoryDocument } from '../category/entities/category.schema';
import { IngredientDocument } from '../ingredient/entities/ingredient.schema';
import { ItemDocument } from '../item/entities/item.schema';

const mockUser = ({
  id = '5f0e8f9b9c9d8b1f8c8b4512',
  login = 'demo',
  name = 'Demo',
  recommendedRecipes = [mockRecipe({})],
  defaultVegan = false,
  defaultVegetarian = false,
  allergyTo = [Allergens.PEANUTS, Allergens.SOYBEANS],
  debug = false,
} = {}): User => ({
  id,
  login,
  name,
  recommendedRecipes,
  defaultVegan,
  defaultVegetarian,
  allergyTo,
  debug,
});

const mockRecipe = ({
  id = '5f0e8f9b9c9d8b1f8c8b4567',
  name = 'Test Recipe',
  description = 'Test Description',
  image = 'Test Image',
  uri = 'Test URI',
  preparationTime = 10,
  servings = 1,
  caloriesPerServing = 100,
  categories = [
    {
      id: '5f0e8f9b9c9d8b1f8c8b4568',
      name: 'Test Category',
    },
  ],
  ingredients = [],
  instructions = 'Test Instructions',
  videoUrl = 'Test Video URL',
  tags = ['Test Tag'],
  author = 'Test Author',
  recipeUrl = 'Test Recipe URL',
  validated = true,
} = {}): Recipe => ({
  id,
  name,
  description,
  image,
  uri,
  preparationTime,
  servings,
  caloriesPerServing,
  categories,
  ingredients,
  instructions,
  videoUrl,
  tags,
  author,
  recipeUrl,
  validated,
});

const mockUserDocument = (mock?: Partial<User>): Partial<UserDocument> => ({
  ...mockUser(),
  _id: '5f0e8f9b9c9d8b1f8c8b4512',
  ...mock,
});

const mockRecipeDocument = (
  mock?: Partial<Recipe>,
): Partial<RecipeDocument> => ({
  ...mockRecipe(),
  _id: '5f0e8f9b9c9d8b1f8c8b4567',
  ...mock,
});

describe('UserService', () => {
  let userService: UserService;
  let recipeService: RecipeService;
  let recommenderService: RecommenderService;
  let categoryService: CategoryService;
  let ingredientService: IngredientService;
  let itemService: ItemService;
  let configService: ConfigService;

  let userModel: Model<UserDocument>;
  let recipeModel: Model<RecipeDocument>;
  let userRecipeInteractionModel: Model<UserRecipeInteractionDocument>;
  let categoryModel: Model<CategoryDocument>;
  let ingredientModel: Model<IngredientDocument>;
  let itemModel: Model<ItemDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        RecipeService,
        CategoryService,
        IngredientService,
        ItemService,
        RecommenderService,
        ConfigService,
        {
          provide: getModelToken('User'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockUser()),
            constructor: jest.fn().mockResolvedValue(mockUser()),
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('Recipe'),
          useValue: {
            new: jest.fn().mockResolvedValue(mockRecipe()),
            constructor: jest.fn().mockResolvedValue(mockRecipe()),
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('UserRecipeInteraction'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('Category'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            findById: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('Ingredient'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
        {
          provide: getModelToken('Item'),
          useValue: {
            new: jest.fn(),
            constructor: jest.fn(),
            find: jest.fn(),
            findById: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            exec: jest.fn(),
          },
        },
      ],
      imports: [],
    }).compile();

    userService = module.get<UserService>(UserService);
    recipeService = module.get<RecipeService>(RecipeService);
    userModel = module.get<Model<UserDocument>>(getModelToken('User'));
    recipeModel = module.get<Model<RecipeDocument>>(getModelToken('Recipe'));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should getPreferences', async () => {
    const testPreferences = {
      allergens: [Allergens.PEANUTS, Allergens.SOYBEANS],
      isVegan: false,
      isVegetarian: false,
    };
    jest.spyOn(userModel, 'findById').mockReturnValueOnce(
      createMock<Query<UserDocument, UserDocument>>({
        exec: jest.fn().mockResolvedValue(mockUserDocument()),
      }) as any,
    );
    const userPreferences = await userService.getPreferences('demo');
    console.log({ userPreferences, testPreferences });

    expect(userPreferences).toEqual(testPreferences);
  });
});
