import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Suggestion} from '../../models/suggestion';

/** Recipes sized to the macros left in the day, each loggable as a meal. */
@Component({
  selector: 'app-meal-suggestion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './meal-suggestion.component.html',
  styleUrl: './meal-suggestion.component.css',
})

export class MealSuggestionComponent {
  /** Shared with the meal log: a suggestion is saved as a meal at this time. */
  @Input() time = "";
  @Output() timeChange = new EventEmitter<string>();

  @Input() suggestions: Suggestion[] = [];

  @Output() suggestionsRequested = new EventEmitter<void>();
  @Output() suggestionAdded = new EventEmitter<Suggestion>();
}
