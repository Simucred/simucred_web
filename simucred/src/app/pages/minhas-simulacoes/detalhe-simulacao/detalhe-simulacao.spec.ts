import { TestBed } from '@angular/core/testing';
import { DetalheSimulacao } from './detalhe-simulacao';
import { StatusBadge } from '../../../shared/status-badge/status-badge';
import { IaAnalise } from '../../../shared/ia-analise/ia-analise';
import { providersDeTeste } from '../../../testing/test-providers';
import { criarSimulacao } from '../../../testing/simulacao-fake';
import { Simulacao } from '../../../core/models/SimulacaoResponse';

describe('DetalheSimulacao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalheSimulacao, StatusBadge, IaAnalise],
      providers: providersDeTeste()
    });
  });

  function criarModal(simulacao: Simulacao) {
    const fixture = TestBed.createComponent(DetalheSimulacao);
    fixture.componentRef.setInput('simulacao', simulacao);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('deve calcular a parcela e o comprometimento dentro do limite', () => {
    const { el } = criarModal(criarSimulacao({ valorParcela: 1000 }));
    expect(el.textContent).toMatch(/R\$\s1\.000,00/);
    expect(el.textContent).toContain('29% (limite: 30%)');
    expect(el.querySelector('.tag.ok')?.textContent).toContain('Dentro do limite');
  });

  it('deve marcar como acima do limite quando a parcela passar de 30%', () => {
    const { el } = criarModal(criarSimulacao({ valorSolicitado: 20000, prazoMeses: 12, valorParcela: 1666.67, status: 'REPROVADO' }));
    expect(el.textContent).toContain('48% (limite: 30%)');
    expect(el.querySelector('.tag')?.textContent).toContain('Acima do limite');
  });

  it('deve considerar comprometimento zero quando a renda não for informada', () => {
    const { el } = criarModal(criarSimulacao({ rendaMensal: 0 }));
    expect(el.textContent).toContain('0% (limite: 30%)');
  });

  it('deve emitir fechar pelo botão, pelo fundo e pelo Esc', () => {
    const { fixture, el } = criarModal(criarSimulacao());
    let fechou = 0;
    fixture.componentInstance.fechar.subscribe(() => fechou++);

    el.querySelector<HTMLButtonElement>('footer button')!.click();
    el.querySelector<HTMLButtonElement>('.fundo')!.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(fechou).toBe(3);
  });
});
