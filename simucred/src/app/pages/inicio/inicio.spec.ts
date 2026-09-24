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

    // 1. Simula a criação de 6 registos e resolve a cascata de pedidos HTTP de cada um
    for (let i = 0; i < 6; i++) {
      service
        .simularCredito({ nome: 'Cliente', cpf: '98765432100', dataNascimento: '1995-01-06', rendaMensal: 5000, valorSolicitado: 1200, prazoMeses: 12 })
        .subscribe();

      // Resolve o POST
      http.expectOne((r) => r.url.endsWith('/simulacoes') && r.method === 'POST').flush({
        id: `id-${i}`,
        cpf: '987.***.***-00',
        nome: 'Cliente',
        valorSolicitado: 1200,
        valorParcela: 100,
        taxaJurosMensal: 0.025,
        status: 'APROVADO',
        justificativaIa: 'ok',
        dataSimulacao: `2026-09-2${i}T10:00:00`
      });

      // Resolve os GETs automáticos do dashboard logo após o POST
      http.expectOne((r) => r.url.endsWith('/resumo') && r.method === 'GET').flush({ total: i + 1, aprovadas: i + 1, reprovadas: 0, emAnalise: 0, taxaAprovacao: 100, valorMedio: 1200 });
      http.expectOne((r) => r.url.endsWith('/simulacoes') && r.method === 'GET').flush([]);
    }

    // 2. Inicializa o componente Inicio (o que engatilha o ngOnInit e novos GETs)
    const fixture = TestBed.createComponent(Inicio);
    fixture.detectChanges();

    // Resolve os GETs de inicialização do ecrã
    http.expectOne((r) => r.url.endsWith('/resumo') && r.method === 'GET').flush({ total: 6, aprovadas: 6, reprovadas: 0, emAnalise: 0, taxaAprovacao: 100, valorMedio: 1200 });

    // Cria a lista de 6 elementos para devolver à listagem
    const mockLista = Array.from({ length: 6 }).map((_, i) => ({
      id: `id-${i}`,
      cpf: '987.***.***-00',
      nome: 'Cliente',
      valorSolicitado: 1200,
      valorParcela: 100,
      taxaJurosMensal: 0.025,
      status: 'APROVADO',
      prazoMeses: 12,
      dataSimulacao: `2026-09-2${i}T10:00:00`
    }));
    http.expectOne((r) => r.url.endsWith('/simulacoes') && r.method === 'GET').flush(mockLista);

    // ADICIONE ESTA LINHA: Avisa o Angular para renderizar os dados recebidos na tabela
    fixture.detectChanges();

    // Verifica se o componente limitou visualmente a 5 elementos na tabela
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveSize(5);
    expect(fixture.nativeElement.textContent).toContain('100%');
  });
});
