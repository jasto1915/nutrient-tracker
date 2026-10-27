import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { ExternalAPIService } from './external-api.service';

describe('ExternalAPIService', () => {
  let service: ExternalAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(ExternalAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
