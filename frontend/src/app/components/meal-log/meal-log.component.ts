import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Meal} from '../../models/meal';

/**
 * The free-text entry box and whatever Nutritionix made of it, held for the
 * user to confirm before anything is saved.
 */
@Component({
  selector: 'app-meal-log',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './meal-log.component.html',
})

export class MealLogComponent {
  /** Shared with the suggestion panel, which saves its recipe at the same time. */
  @Input() time = "";
  @Output() timeChange = new EventEmitter<string>();

  @Input() parsedMeals: Meal[] = [];

  @Output() parseRequested = new EventEmitter<string>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() nextDayRequested = new EventEmitter<void>();

  text = "";

  parse(){
    this.parseRequested.emit(this.text);
  }
}
