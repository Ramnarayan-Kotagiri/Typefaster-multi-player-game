import { TestBed } from '@angular/core/testing';

import { RandomnameService } from './randomname.service';

describe('RandomnameService', () => {
  let service: RandomnameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomnameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
