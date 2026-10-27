import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

import {DatabaseService, DailyGoal} from './database.service';
import {NETWORK_ERROR} from './api-response';

const GOAL_URL = "/api/database/user/getNutrientGoalAndProgress";

describe('DatabaseService', () => {
  let service: DatabaseService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(DatabaseService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should hand back the payload without the envelope around it', () => {
    const received: (DailyGoal | null)[] = [];
    service.getNutrientGoalAndProgress().subscribe(goal => received.push(goal));

    http.expectOne(GOAL_URL).flush({
      status: "success",
      nutrients: [{name: "calories", value: 420, max: 3040}],
      goal: "Gain Weight",
    });

    expect(received[0]?.goal).toBe("Gain Weight");
    expect(received[0]?.nutrients.length).toBe(1);
  });

  // A missing user is how the app decides to show the setup form, so it has to
  // arrive as a value rather than as an error.
  it('should resolve to null when no user has been set up', () => {
    const received: (DailyGoal | null)[] = [];
    service.getNutrientGoalAndProgress().subscribe(goal => received.push(goal));

    http.expectOne(GOAL_URL).flush({status: "failed", msg: "there is no user"});

    expect(received).toEqual([null]);
  });

  it('should raise the backend message when a call fails', () => {
    const errors: string[] = [];
    service.nextDay().subscribe({error: err => errors.push(err.message)});

    http.expectOne("/api/database/user/nextDay")
      .flush({status: "failed", msg: "could not advance the day, please try again"});

    expect(errors).toEqual(["could not advance the day, please try again"]);
  });

  // A rejected request now comes back as a 4xx, but the body is still the
  // usual envelope, so the message written for the user has to survive it.
  it('should raise the backend message when the call is rejected with an error status', () => {
    const errors: string[] = [];
    service.nextDay().subscribe({error: err => errors.push(err.message)});

    http.expectOne("/api/database/user/nextDay").flush(
      {status: "failed", msg: "there is no user"},
      {status: 409, statusText: "Conflict"},
    );

    expect(errors).toEqual(["there is no user"]);
  });

  it('should raise a readable message when the server cannot be reached', () => {
    const errors: string[] = [];
    service.getMealHistory().subscribe({error: err => errors.push(err.message)});

    http.expectOne("/api/database/user/getMealHistory").error(new ProgressEvent("network error"));

    expect(errors).toEqual([NETWORK_ERROR]);
  });
});
