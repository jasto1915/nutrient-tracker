import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {AppComponent} from './app.component';

const GOAL_URL = "/api/database/user/getNutrientGoalAndProgress";
const MEALS_URL = "/api/database/user/getMealProgress";
const HISTORY_URL = "/api/database/user/getMealHistory";

const NO_USER = {status: "failed", msg: "there is no user"};
const A_GOAL = {
  status: "success",
  nutrients: [{name: "calories", value: 420, max: 3040}],
  goal: "Gain Weight",
};

describe('AppComponent', () => {
  let http: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show the user form until a user exists', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    http.expectOne(GOAL_URL).flush(NO_USER);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('#activity-level')).toBeTruthy();
  });

  // Both of these resolve the current day from the user document, so asking
  // before one exists used to fail and put an error in front of someone who
  // had not filled the form in yet.
  it('should not ask for the day before a user exists', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    http.expectOne(GOAL_URL).flush(NO_USER);

    expect(http.match(MEALS_URL).length).toBe(0);
    expect(http.match(HISTORY_URL).length).toBe(0);
  });

  // History used to load only when Next Day was pressed, so a reload showed
  // none of the days already finished.
  it('should load the day and the history once a user exists', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    http.expectOne(GOAL_URL).flush(A_GOAL);

    http.expectOne(MEALS_URL).flush({status: "success", breakfast: [], lunch: [], dinner: []});
    http.expectOne(HISTORY_URL).flush({status: "success", historyList: []});
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('app-nutrient-goal')).toBeTruthy();
    expect(compiled.querySelector('#activity-level')).toBeFalsy();
  });

  it('should show the message the backend sent when a call fails', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    http.expectOne(GOAL_URL).flush(A_GOAL);
    http.expectOne(MEALS_URL).flush({status: "success", breakfast: [], lunch: [], dinner: []});
    http.expectOne(HISTORY_URL).flush({status: "failed", msg: "could not load history, please try again"});
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('[role="alert"]')?.textContent)
      .toContain("could not load history, please try again");
  });

  it('should refuse to log a suggestion before a time is chosen', () => {
    const fixture = TestBed.createComponent(AppComponent);

    fixture.componentInstance.addSuggestion({
      id: 1, title: "salmon with rice", image: "",
      calories: 720, protein: "52g", carbs: "60g", fat: "20g",
    });

    expect(fixture.componentInstance.errorMessage)
      .toBe("Pick a time before adding a suggested meal");
  });

  it('should log a suggestion as a meal once a time is chosen', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.componentInstance.time = "19:00";

    fixture.componentInstance.addSuggestion({
      id: 1, title: "salmon with rice", image: "",
      calories: 720, protein: "52g", carbs: "60g", fat: "20g",
    });

    // Spoonacular reports macros as "52g", but the Meal schema needs numbers.
    const request = http.expectOne("/api/database/meal/add");
    expect(request.request.body).toEqual([{
      name: "salmon with rice",
      servingQty: 1,
      servingUnit: "plate",
      servingWeightGram: 0,
      calories: 720,
      protein: 52,
      carbs: 60,
      fats: 20,
      time: "19:00",
    }]);

    request.flush({status: "success"});
    http.expectOne(GOAL_URL).flush(NO_USER);
  });
});
