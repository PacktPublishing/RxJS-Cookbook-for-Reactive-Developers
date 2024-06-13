import { TestBed } from '@angular/core/testing';

import { QueryClientService } from './query-client.service';

describe('QueryClientService', () => {
  let service: QueryClientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QueryClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
