import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, catchError, map, throwError} from 'rxjs';
import {ApiResponse, NETWORK_ERROR, unwrap} from './api-response';
import {Meal} from './models/meal';
import {User} from './models/user';
import {Nutrient} from './models/nutrient';
import {DaySummary} from './models/day-summary';

const httpOptions = {
  headers: new HttpHeaders({"Content-Type": "application/json"})
};

const API_URL = "/api/database"

/** The day's targets and the progress against them. */
export interface DailyGoal {
  nutrients: Nutrient[];
  goal: string;
}

/** Today's meals, in the 3 slots the backend buckets them into by hour. */
export interface DailyMeals {
  breakfast: Meal[];
  lunch: Meal[];
  dinner: Meal[];
}

interface GoalResponse extends ApiResponse, DailyGoal {}
interface MealsResponse extends ApiResponse, DailyMeals {}
interface HistoryResponse extends ApiResponse {
  historyList: DaySummary[];
}

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {

  constructor(private http: HttpClient) { }


  addMeal(meals: Meal[]): Observable<void> {
    let url = API_URL + "/meal/add";
    return this.http.post<ApiResponse>(url, meals, httpOptions)
      .pipe(unwrap<ApiResponse, void>(() => undefined));
  }

  addUserInfo(user: User): Observable<void> {
    let url = API_URL + "/user/add";
    return this.http.post<ApiResponse>(url, user, httpOptions)
      .pipe(unwrap<ApiResponse, void>(() => undefined));
  }

  /**
   * Resolves to null when no user has been set up yet. That is how the app
   * decides to show the setup form, so it is not an error and is not reported
   * as one.
   */
  getNutrientGoalAndProgress(): Observable<DailyGoal | null> {
    let url = API_URL + "/user/getNutrientGoalAndProgress";
    return this.http.get<GoalResponse>(url).pipe(
      map(response => response.status === "success"
        ? {nutrients: response.nutrients, goal: response.goal}
        : null),
      catchError(() => throwError(() => new Error(NETWORK_ERROR))),
    );
  }

  getDailyMealProgress(): Observable<DailyMeals> {
    let url = API_URL + "/user/getMealProgress";
    return this.http.get<MealsResponse>(url).pipe(
      unwrap<MealsResponse, DailyMeals>(response => ({
        breakfast: response.breakfast,
        lunch: response.lunch,
        dinner: response.dinner,
      })));
  }

  nextDay(): Observable<void> {
    let url = API_URL + "/user/nextDay";
    return this.http.post<ApiResponse>(url, {}, httpOptions)
      .pipe(unwrap<ApiResponse, void>(() => undefined));
  }

  getMealHistory(): Observable<DaySummary[]> {
    let url = API_URL + "/user/getMealHistory";
    return this.http.get<HistoryResponse>(url)
      .pipe(unwrap<HistoryResponse, DaySummary[]>(response => response.historyList));
  }


}
