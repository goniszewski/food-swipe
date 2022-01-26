import { InteractionSources } from 'src/shared/constants/interaction-sources.enum';

export class AddUserRecipeInteractionDto {
  userId: string;
  recipeId: string;
  timestamp?: Date;
  source: InteractionSources;
}
