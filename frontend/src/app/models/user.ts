/**
 * The body metrics the daily targets are calculated from. Gender, activity
 * level and goal are matched by exact string in the backend, so the values the
 * setup form submits have to stay in step with ACTIVITY_MULTIPLIERS and the
 * validation in backend/controllers/Database-controller.js.
 */
export interface User {
  name: string;
  age: number;
  gender: string;
  height: number;
  weight: number;
  activityLevel: string;
  goal: string;
}
