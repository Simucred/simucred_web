import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { signal, computed } from '@angular/core';

import { MinhasSimulacoes } from './minhas-simulacoes';
import { DetalheSimulacao } from './detalhe-simulacao/detalhe-simulacao';
import { StatusBadge } from '../../shared/status-badge/status-badge';
import { SimulacaoService } from '../../core/services/simulacao';
import { Simulacao } from '../../core/models/SimulacaoResponse';
import { providersDeTeste } from '../../testing/test-providers';
import { criarSimulacao } from '../../testing/simulacao-fake';

describe('MinhasSimulacoes', () => {
  const lista = signal<Simulacao[]>([]);

  const serviceFake = {
    simulacoes: lista,
    resumo: computed(() => ({
      total: lista().length,
      aprovadas: lista().filter((s) => s.status === 'APROVADO').length,
      reprovadas: lista().filter((s) => s.status === 'REPROVADO').length,
      emAnalise: 0,
      valorMedio: 0,
      taxaAprovacao: 0
    }))
  };

  beforeEach(() => {
    lista.set([]);
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [MinhasSimulacoes, DetalheSimulacao, StatusBadge],
      providers: [...providersDeTeste(), { provide: SimulacaoService, useValue: serviceFake }]
    });
  });

  function criarTela() {
    const fixture = TestBed.createComponent(MinhasSimulacoes);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('deve mostrar a mensagem de lista vazia', () => {
    const { el } = criarTela();
    expect(el.querySelector('.vazio')?.textContent).toContain('ainda não fez nenhuma simulação');
  });

  it('deve listar as simulações e calcular o percentual dos indicadores', () => {
    lista.set([
      criarSimulacao({ id: '1', status: 'APROVADO' }),
      criarSimulacao({ id: '2', status: 'REPROVADO', nome: 'João Pereira Lima' })
    ]);
    const { el } = criarTela();

    expect(el.querySelectorAll('tbody tr')).toHaveSize(2);
    expect(el.textContent).toContain('João Pereira Lima');
    expect(el.textContent).toContain('50% do total');
  });

  it('deve abrir e fechar o modal de detalhes', async () => {
    lista.set([criarSimulacao()]);
    const { fixture, el } = criarTela();

    el.querySelector<HTMLButtonElement>('tbody .btn-link')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('app-detalhe-simulacao')).not.toBeNull();

    el.querySelector<HTMLButtonElement>('app-detalhe-simulacao footer button')!.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(el.querySelector('app-detalhe-simulacao')).toBeNull();
  });
});
