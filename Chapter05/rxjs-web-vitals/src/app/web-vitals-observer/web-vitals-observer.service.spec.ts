import { TestBed } from '@angular/core/testing';

import { WebVitalsObserverService } from './web-vitals-observer.service';

describe('WebVitalsObserverService', () => {
  let service: WebVitalsObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebVitalsObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
