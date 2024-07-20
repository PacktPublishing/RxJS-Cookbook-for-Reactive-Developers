import { TestBed } from '@angular/core/testing';

import { NetworkStatusService } from './network-status.service';

describe('NetworkStatusService', () => {
  let service: NetworkStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NetworkStatusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
