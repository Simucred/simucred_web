import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SimulacaoService } from './simulacao';
import { SimulacaoRequest } from '../models/SimulacaoRequest';
import { environment } from '../../../environments/environment';

describe('SimulacaoService', () => {
  let service: SimulacaoService;
  let httpMock: HttpTestingController;

  const request: SimulacaoRequest = {
    nome: 'Maria Silva Santos',
    cpf: '52998224725',
    idade: 31,
    rendaMensal: 3500,
    valorSolicitado: 25000,
    prazoMeses: 72
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SimulacaoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('deve enviar a simulacao para /v1/simulacoes e guardar no historico', () => {
    let statusRecebido = '';
    service.simularCredito(request).subscribe((s) => (statusRecebido = s.status));

    const req = httpMock.expectOne((r) => r.url.endsWith('/v1/simulacoes'));
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(request);

    req.flush({
      id: 'b0f3c1e2-1111-4000-8000-000000000001',
      cpf: '529.***.***-25',
      nome: request.nome,
      valorSolicitado: request.valorSolicitado,
      status: 'APROVADO',
      justificativaIa: 'Crédito aprovado.',
      dataSimulacao: '2026-09-23T10:00:00'
    });

    expect(statusRecebido).toBe('APROVADO');
    expect(service.simulacoes()).toHaveSize(1);
    expect(service.simulacoes()[0].prazoMeses).toBe(72);
    expect(service.resumo().taxaAprovacao).toBe(100);
  });

  it('deve comecar com o historico vazio fora do modo mock', () => {
    expect(service.resumo().total).toBe(0);
  });
});

describe('SimulacaoService (modo mock)', () => {
  let service: SimulacaoService;

  beforeEach(() => {
    environment.mockApi = true;
    jasmine.clock().install();
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(SimulacaoService);
  });

  afterEach(() => {
    environment.mockApi = false;
    jasmine.clock().uninstall();
  });

  function simular(rendaMensal: number, valorSolicitado: number, prazoMeses: number) {
    let status = '';
    service
      .simularCredito({ nome: 'Maria', cpf: '52998224725', idade: 31, rendaMensal, valorSolicitado, prazoMeses })
      .subscribe((s) => {
        status = s.status;
      });
    jasmine.clock().tick(600);
    return status;
  }

  it('deve carregar as simulacoes de exemplo', () => {
    expect(service.resumo().total).toBe(5);
  });

  it('deve aprovar quando a parcela cabe em 30% da renda', () => {
    // 24.000 / 24 = 1.000 de parcela; 3 x 1.000 = 3.000 <= 3.500
    expect(simular(3500, 24000, 24)).toBe('APROVADO');
  });

  it('deve reprovar quando a parcela passa de 30% da renda', () => {
    // 20.000 / 12 = 1.666,67 de parcela; 3 x 1.666,67 = 5.000 > 3.500
    expect(simular(3500, 20000, 12)).toBe('REPROVADO');
  });

  it('deve mascarar o CPF como a API faz', () => {
    simular(3500, 24000, 24);
    expect(service.simulacoes()[0].cpf).toBe('529.***.***-25');
  });
});
