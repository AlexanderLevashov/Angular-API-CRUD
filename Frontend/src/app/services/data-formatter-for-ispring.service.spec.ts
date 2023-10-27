import { TestBed } from '@angular/core/testing';

import { DataFormatterForIspringService } from './data-formatter-for-ispring.service';

describe('DataFormatterForIspringService', () => {
  let service: DataFormatterForIspringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFormatterForIspringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
