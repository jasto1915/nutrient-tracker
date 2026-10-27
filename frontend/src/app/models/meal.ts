/**
 * A single food item, either as Nutritionix parsed it or as the backend stored
 * it. The field names match the Meal schema in backend/model/Meal.js.
 */
export interface Meal {
  name: string;
  servingQty: number;
  servingUnit: string;
  servingWeightGram: number;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  time: string;
}
