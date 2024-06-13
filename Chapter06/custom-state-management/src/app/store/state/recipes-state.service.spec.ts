import { TestBed } from '@angular/core/testing';

import { RecipesStateService } from './recipes-store.service';

describe('RecipesStateService', () => {
  let service: RecipesStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecipesStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
