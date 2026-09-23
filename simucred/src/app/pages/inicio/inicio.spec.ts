import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { HttpTestingController } from '@angular/common/http/testing';

import { Inicio } from './inicio';
import { StatusBadge } from '../../shared/status-badge/status-badge';
import { SimulacaoService } from '../../core/services/simulacao';
import { providersDeTeste } from '../../testing/test-providers';

describe('Inicio', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [Inicio, StatusBadge],
      providers: providersDeTeste()
    });
  });

  it('deve dar boas-vindas com o primeiro nome do usuário', () => {
    const fixture = TestBed.createComponent(Inicio);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('h1').textContent).toContain('Olá, Maria!');
  });

  it('deve mostrar mensagem quando não houver simulações', () => {
    const fixture = TestBed.createComponent(Inicio);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.vazio')).not.toBeNull();
  });

  it('deve listar no máximo 5 simulações recentes', () => {
    const service = TestBed.inject(SimulacaoService);
    const http = TestBed.inject(HttpTestingController);

    for (let i = 0; i < 6; i++) {
      service
        .simularCredito({ nome: 'Cliente', cpf: '52998224725', idade: 30, rendaMensal: 5000, valorSolicitado: 1200, prazoMeses: 12 })
        .subscribe();
      http.expectOne((r) => r.url.endsWith('/v1/simulacoes')).flush({
        id: `id-${i}`,
        cpf: '529.***.***-25',
        nome: 'Cliente',
        valorSolicitado: 1200,
        status: 'APROVADO',
        justificativaIa: 'ok',
        dataSimulacao: `2026-09-2${i}T10:00:00`
      });
    }

    const fixture = TestBed.createComponent(Inicio);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('tbody tr').length).toBe(5);
    expect(fixture.nativeElement.textContent).toContain('100%');
  });
});
