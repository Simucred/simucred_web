import { TestBed } from '@angular/core/testing';

import { Simulacao } from './simulacao';

describe('Simulacao', () => {
  let service: Simulacao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Simulacao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
