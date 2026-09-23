import { TestBed } from '@angular/core/testing';
import { DetalheSimulacao } from './detalhe-simulacao';
import { StatusBadge } from '../../../shared/status-badge/status-badge';
import { providersDeTeste } from '../../../testing/test-providers';
import { criarSimulacao } from '../../../testing/simulacao-fake';
import { Simulacao } from '../../../core/models/SimulacaoResponse';

describe('DetalheSimulacao', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetalheSimulacao, StatusBadge],
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
    // 24.000 / 24 = 1.000 de parcela; 1.000 / 3.500 = 29%
    const { el } = criarModal(criarSimulacao());
    // o CurrencyPipe usa espaço não separável entre "R$" e o valor
    expect(el.textContent).toMatch(/R\$\s1\.000,00/);
    expect(el.textContent).toContain('29% (limite: 30%)');
    expect(el.querySelector('.tag.ok')?.textContent).toContain('Dentro do limite');
  });

  it('deve marcar como acima do limite quando a parcela passar de 30%', () => {
    // 20.000 / 12 = 1.666,67 de parcela; 1.666,67 / 3.500 = 48%
    const { el } = criarModal(criarSimulacao({ valorSolicitado: 20000, prazoMeses: 12, status: 'REPROVADO' }));
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
