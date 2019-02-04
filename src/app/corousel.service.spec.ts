import { TestBed } from '@angular/core/testing';

import { CorouselService } from './corousel.service';

describe('CorouselService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CorouselService = TestBed.get(CorouselService);
    expect(service).toBeTruthy();
  });
});
