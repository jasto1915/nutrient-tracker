import {TestBed} from '@angular/core/testing';

import {SetupFormComponent} from './setup-form.component';
import {User} from '../../models/user';

describe('SetupFormComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetupFormComponent],
    }).compileComponents();
  });

  it('should offer every activity level the backend recognises', () => {
    const fixture = TestBed.createComponent(SetupFormComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const values = Array.from(compiled.querySelectorAll('#activity-level option'))
      .map(option => (option as HTMLOptionElement).value);

    // These values are matched by name in the backend's ACTIVITY_MULTIPLIERS
    // lookup. If they drift, the multiplier is silently never applied.
    expect(values).toEqual([
      'Sedentary',
      'Lightly Active',
      'Moderately Active',
      'Very Active',
      'Extra Active',
    ]);
  });

  it('should emit the filled-in user when the button is pressed', () => {
    const fixture = TestBed.createComponent(SetupFormComponent);
    const emitted: User[] = [];
    fixture.componentInstance.submitted.subscribe(user => emitted.push(user));

    fixture.componentInstance.user.name = "Test User";
    fixture.componentInstance.user.goal = "Gain Weight";
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(emitted.length).toBe(1);
    expect(emitted[0].name).toBe("Test User");
    expect(emitted[0].goal).toBe("Gain Weight");
  });
});
