/** One macronutrient for the current day: how much is eaten, against the target. */
export interface Nutrient {
  name: string;
  value: number;
  max: number;
}
