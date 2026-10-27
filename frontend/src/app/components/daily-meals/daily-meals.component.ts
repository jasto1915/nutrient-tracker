import {Component, Input} from '@angular/core';
import {Meal} from '../../models/meal';

/** One of the 3 slots a meal is bucketed into, with the meals in it. */
interface MealSlot {
  label: string;
  meals: Meal[];
}

/**
 * Today's meals, grouped the way the backend buckets them by hour: to 10:59,
 * to 16:59, and later.
 */
@Component({
  selector: 'app-daily-meals',
  standalone: true,
  templateUrl: './daily-meals.component.html',
  styleUrl: './daily-meals.component.css',
})

export class DailyMealsComponent {
  @Input() breakfast: Meal[] = [];
  @Input() lunch: Meal[] = [];
  @Input() dinner: Meal[] = [];

  /**
   * The 3 slots render identically, so the template loops over them instead of
   * repeating the markup. Built on read rather than in ngOnChanges, which only
   * runs once something is actually bound and so left the panel blank when it
   * was not.
   */
  get slots(): MealSlot[] {
    return [
      {label: "Breakfast", meals: this.breakfast},
      {label: "Lunch", meals: this.lunch},
      {label: "Dinner", meals: this.dinner},
    ];
  }
}
