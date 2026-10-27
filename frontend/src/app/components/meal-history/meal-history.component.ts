import {Component, Input} from '@angular/core';
import {DaySummary} from '../../models/day-summary';

/** The days already finished, with what each one ended on. */
@Component({
  selector: 'app-meal-history',
  standalone: true,
  templateUrl: './meal-history.component.html',
  styleUrl: './meal-history.component.css',
})

export class MealHistoryComponent {
  @Input() history: DaySummary[] = [];
}
