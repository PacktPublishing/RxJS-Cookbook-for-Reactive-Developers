import { TestBed } from '@angular/core/testing';

import { AudioServiceService } from './audio-service.service';

describe('AudioServiceService', () => {
  let service: AudioServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudioServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
