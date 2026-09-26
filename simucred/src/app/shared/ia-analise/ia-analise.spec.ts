import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { IaAnalise } from './ia-analise';

describe('IaAnalise', () => {
  let component: IaAnalise;
  let fixture: ComponentFixture<IaAnalise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IaAnalise],
      providers: [provideZonelessChangeDetection()]
    }).compileComponents();

    fixture = TestBed.createComponent(IaAnalise);
    component = fixture.componentInstance;
  });

  it('should create and render basic analysis', () => {
    fixture.componentRef.setInput('valorSolicitado', 10000);
    fixture.componentRef.setInput('prazoMeses', 24);
    fixture.componentRef.setInput('valorParcela', 550);
    fixture.componentRef.setInput('rendaMensal', 3000);
    fixture.componentRef.setInput('status', 'APROVADO');
    fixture.componentRef.setInput('justificativa', 'Crédito aprovado.');

    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component['textoExplicativo']()).toContain('Crédito aprovado:');
    expect(component['dentroDoLimite']()).toBeTrue();
  });

  it('should detect when commitment exceeds 30%', () => {
    fixture.componentRef.setInput('valorSolicitado', 50000);
    fixture.componentRef.setInput('prazoMeses', 12);
    fixture.componentRef.setInput('valorParcela', 4500);
    fixture.componentRef.setInput('rendaMensal', 5000);
    fixture.componentRef.setInput('status', 'REPROVADO');

    fixture.detectChanges();

    expect(component['comprometimento']()).toBe(90);
    expect(component['dentroDoLimite']()).toBeFalse();
  });
});
