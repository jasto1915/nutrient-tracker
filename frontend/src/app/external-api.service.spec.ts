import {TestBed} from '@angular/core/testing';
import {provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

import {ExternalAPIService} from './external-api.service';
import {Meal} from './models/meal';

const PARSE_URL = "/api/external-api/freeform-input/parse";

describe('ExternalAPIService', () => {
  let service: ExternalAPIService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ExternalAPIService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should send the text and the time, and return the parsed meals', () => {
    const received: Meal[][] = [];
    service.parseLanguage("a whole grain bread with peanut butter jam", "08:30")
      .subscribe(meals => received.push(meals));

    const request = http.expectOne(PARSE_URL);
    expect(request.request.body).toEqual({
      text: "a whole grain bread with peanut butter jam",
      time: "08:30",
    });

    request.flush({status: "success", meals: [{name: "peanut butter", calories: 190}]});

    expect(received[0].length).toBe(1);
    expect(received[0][0].name).toBe("peanut butter");
  });

  it('should raise the backend message when the parse fails', () => {
    const errors: string[] = [];
    service.parseLanguage("qqq", "08:30").subscribe({error: err => errors.push(err.message)});

    http.expectOne(PARSE_URL)
      .flush({status: "failed", msg: "could not parse that meal, please try again"});

    expect(errors).toEqual(["could not parse that meal, please try again"]);
  });
});
