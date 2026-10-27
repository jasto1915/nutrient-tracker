/** A day the user has already finished, as shown in the history panel. */
export interface DaySummary {
  date: string;
  dateId: string;
  macronutrientProgress: { name: string, value: number }[];
}
