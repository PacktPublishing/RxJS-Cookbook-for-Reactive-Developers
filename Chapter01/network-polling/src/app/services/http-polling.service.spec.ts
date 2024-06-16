import { TestBed } from '@angular/core/testing';

import { HttpPollingService } from './http-polling.service';

describe('HttpPollingService', () => {
  let service: HttpPollingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpPollingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
