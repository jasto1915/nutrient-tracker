import {TestBed} from '@angular/core/testing';

import {DailyMealsComponent} from './daily-meals.component';
import {Meal} from '../../models/meal';

function meal(name: string, time: string): Meal {
  return {
    name: name, servingQty: 1, servingUnit: "plate", servingWeightGram: 0,
    calories: 400, protein: 20, carbs: 40, fats: 10, time: time,
  };
}

describe('DailyMealsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyMealsComponent],
    }).compileComponents();
  });

  it('should label the 3 slots a meal can fall into', () => {
    const fixture = TestBed.createComponent(DailyMealsComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const labels = Array.from(compiled.querySelectorAll('.meal-slot'))
      .map(slot => slot.textContent);

    expect(labels).toEqual(['Breakfast', 'Lunch', 'Dinner']);
  });

  it('should list the meals it is given under the right slot', () => {
    const fixture = TestBed.createComponent(DailyMealsComponent);
    fixture.componentRef.setInput('lunch', [meal("grilled chicken salad", "12:30")]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const entries = compiled.querySelectorAll('.meal-entry');

    expect(entries.length).toBe(1);
    expect(entries[0].textContent).toContain("grilled chicken salad");
  });

  it('should show a placeholder for a slot with nothing in it', () => {
    const fixture = TestBed.createComponent(DailyMealsComponent);
    fixture.componentRef.setInput('breakfast', [meal("toast", "08:00")]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    // Breakfast is filled, so only lunch and dinner should be empty.
    expect(compiled.querySelectorAll('.meal-entry').length).toBe(1);
    expect(compiled.querySelectorAll('.col-md-4 p').length).toBe(2);
  });
});
