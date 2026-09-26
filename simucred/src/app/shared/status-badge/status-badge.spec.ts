import { TestBed } from '@angular/core/testing';
import { StatusBadge } from './status-badge';
import { providersDeTeste } from '../../testing/test-providers';

describe('StatusBadge', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StatusBadge],
      providers: providersDeTeste()
    });
  });

  function renderizar(status: 'APROVADO' | 'REPROVADO' | 'EM_ANALISE') {
    const fixture = TestBed.createComponent(StatusBadge);
    fixture.componentRef.setInput('status', status);
    fixture.detectChanges();
    return fixture.nativeElement.querySelector('.badge') as HTMLElement;
  }

  it('deve mostrar "Aprovada" com a cor verde', () => {
    const badge = renderizar('APROVADO');
    expect(badge.textContent).toContain('Aprovada');
    expect(badge.classList).toContain('aprovado');
  });

  it('deve mostrar "Reprovada" com a cor vermelha', () => {
    const badge = renderizar('REPROVADO');
    expect(badge.textContent).toContain('Reprovada');
    expect(badge.classList).toContain('reprovado');
  });

  it('deve mostrar "Em análise"', () => {
    expect(renderizar('EM_ANALISE').textContent).toContain('Em análise');
  });
});
