import { Allergens } from 'src/shared/constants/allergens.enum';

export class UpdateUserPreferencesDto {
  name?: string;
  defaultVegan?: boolean;
  defaultVegetarian?: boolean;
  allergyTo?: Allergens[];
}
