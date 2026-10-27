/**
 * A recipe from Spoonacular's findByNutrients endpoint. The macros come back
 * with a unit suffix, "30g" rather than 30, which is why they are strings here
 * and have to be parsed before a suggestion can be saved as a meal.
 */
export interface Suggestion {
  id: number;
  title: string;
  image: string;
  calories: number;
  protein: string;
  carbs: string;
  fat: string;
}
