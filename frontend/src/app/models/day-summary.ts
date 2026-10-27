/** A day the user has already finished, as shown in the history panel. */
export interface DaySummary {
  /** Calendar date as YYYY-MM-DD, which is also what identifies the day. */
  dateId: string;
  macronutrientProgress: { name: string, value: number }[];
}
