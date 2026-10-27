import {Component, Input} from '@angular/core';
import {Nutrient} from '../../models/nutrient';

/** How far through the day's calorie and macronutrient targets the user is. */
@Component({
  selector: 'app-nutrient-goal',
  standalone: true,
  templateUrl: './nutrient-goal.component.html',
  styleUrl: './nutrient-goal.component.css',
})

export class NutrientGoalComponent {
  @Input() nutrients: Nutrient[] = [];
  @Input() goal = "";
}
