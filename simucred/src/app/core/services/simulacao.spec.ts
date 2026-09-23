import { provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { SimulacaoService } from './simulacao';
import { SimulacaoRequest } from '../models/SimulacaoRequest';

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
    expect(service.simulacoes().length).toBe(1);
    expect(service.simulacoes()[0].prazoMeses).toBe(72);
    expect(service.resumo().taxaAprovacao).toBe(100);
  });

  it('deve comecar com o historico vazio fora do modo mock', () => {
    expect(service.resumo().total).toBe(0);
  });
});
