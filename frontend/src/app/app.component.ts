import {Component, OnInit} from '@angular/core';
import {DatabaseService} from './database.service';
import {ExternalAPIService} from './external-api.service';
import {Meal} from './models/meal';
import {User} from './models/user';
import {Nutrient} from './models/nutrient';
import {DaySummary} from './models/day-summary';
import {Suggestion} from './models/suggestion';
import {SetupFormComponent} from './components/setup-form/setup-form.component';
import {MealLogComponent} from './components/meal-log/meal-log.component';
import {DailyMealsComponent} from './components/daily-meals/daily-meals.component';
import {NutrientGoalComponent} from './components/nutrient-goal/nutrient-goal.component';
import {MealSuggestionComponent} from './components/meal-suggestion/meal-suggestion.component';
import {MealHistoryComponent} from './components/meal-history/meal-history.component';

/**
 * Holds the state the panels share and owns every call to the backend. The
 * panels render what they are handed and report back what the user did, so the
 * order things happen in is readable from this one file.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SetupFormComponent, MealLogComponent, DailyMealsComponent,
    NutrientGoalComponent, MealSuggestionComponent, MealHistoryComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})

export class AppComponent implements OnInit {
  userExists = false
  errorMessage = ""
  goal = ""

  /** Shared by the meal log and the suggestion panel, which both save at a time. */
  time = ""

  parsedMeals: Meal[] = []
  nutrients: Nutrient[] = []
  breakfast: Meal[] = []
  lunch: Meal[] = []
  dinner: Meal[] = []
  suggestions: Suggestion[] = []
  history: DaySummary[] = []

  constructor(private db: DatabaseService, private extapi: ExternalAPIService) {}

  ngOnInit(){
    this.loadGoal()
  }

  createUser(user: User){
    this.errorMessage = ""
    this.db.addUserInfo(user).subscribe({
      next: () => this.loadGoal(),
      error: err => this.errorMessage = err.message,
    })
  }

  parseMeal(text: string){
    this.errorMessage = ""
    this.extapi.parseLanguage(text, this.time).subscribe({
      next: meals => this.parsedMeals = meals,
      error: err => this.errorMessage = err.message,
    })
  }

  confirmMeal(){
    this.errorMessage = ""
    this.db.addMeal(this.parsedMeals).subscribe({
      next: () => {
        this.parsedMeals = []
        this.suggestions = []
        this.time = ""
        this.loadGoal()
      },
      error: err => this.errorMessage = err.message,
    })
  }

  /**
   * A suggestion is logged by turning it into a meal and saving it down the
   * same path a parsed meal takes. Spoonacular reports macros as "30g", so
   * they are read back to numbers here.
   */
  addSuggestion(suggestion: Suggestion){
    // Time is required by the Meal schema; without this the save failed with a
    // generic error and no indication that a time was missing.
    if(!this.time){
      this.errorMessage = "Pick a time before adding a suggested meal"
      return
    }

    this.parsedMeals = [{
      name: suggestion.title,
      servingQty: 1,
      servingUnit: "plate",
      servingWeightGram: 0,
      calories: parseInt(String(suggestion.calories)),
      protein: parseInt(suggestion.protein),
      carbs: parseInt(suggestion.carbs),
      fats: parseInt(suggestion.fat),
      time: this.time,
    }]
    this.confirmMeal()
  }

  suggestMeals(){
    this.errorMessage = ""
    this.extapi.suggestMeal().subscribe({
      next: suggestions => this.suggestions = suggestions,
      error: err => this.errorMessage = err.message,
    })
  }

  nextDay(){
    this.errorMessage = ""
    this.db.nextDay().subscribe({
      // A failure here used to be swallowed, leaving the panels showing the old
      // day as though it had rolled over.
      next: () => {
        this.suggestions = []
        this.loadGoal()
      },
      error: err => this.errorMessage = err.message,
    })
  }

  /**
   * Null means no user has been set up, which is what puts the setup form on
   * screen. Everything else about the day hangs off this call, so it is also
   * how the rest of the panels get refreshed.
   */
  private loadGoal(){
    this.db.getNutrientGoalAndProgress().subscribe({
      next: goal => {
        this.userExists = goal !== null
        if(goal !== null){
          this.nutrients = goal.nutrients
          this.goal = goal.goal
          this.loadDay()
        }
      },
      error: err => this.errorMessage = err.message,
    })
  }

  /**
   * Only safe to call once a user exists: both endpoints resolve the current
   * day from the user document and fail without one.
   */
  private loadDay(){
    this.db.getDailyMealProgress().subscribe({
      next: meals => {
        this.breakfast = meals.breakfast
        this.lunch = meals.lunch
        this.dinner = meals.dinner
      },
      error: err => this.errorMessage = err.message,
    })

    // History used to load only when the Next Day button was pressed, so a
    // reload showed none of the days already finished.
    this.db.getMealHistory().subscribe({
      next: history => this.history = history,
      error: err => this.errorMessage = err.message,
    })
  }
}
