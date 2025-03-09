import { TestBed } from '@angular/core/testing';

import { RxdbService } from './rxdb.service';

describe('RxdbService', () => {
  let service: RxdbService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RxdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
