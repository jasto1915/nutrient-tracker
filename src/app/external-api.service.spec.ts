import { TestBed } from '@angular/core/testing';

import { ExternalAPIService } from './external-api.service';

describe('ExternalAPIService', () => {
  let service: ExternalAPIService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExternalAPIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
