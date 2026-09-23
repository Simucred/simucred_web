import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { NovaSimulacao } from './nova-simulacao';
import { StatusBadge } from '../../shared/status-badge/status-badge';
import { SimulacaoService } from '../../core/services/simulacao';
import { providersDeTeste } from '../../testing/test-providers';
import { criarSimulacao } from '../../testing/simulacao-fake';

describe('NovaSimulacao', () => {
  let simulacaoService: jasmine.SpyObj<SimulacaoService>;

  beforeEach(() => {
    simulacaoService = jasmine.createSpyObj<SimulacaoService>('SimulacaoService', ['simularCredito']);
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterModule.forRoot([])],
      declarations: [NovaSimulacao, StatusBadge],
      providers: [...providersDeTeste(), { provide: SimulacaoService, useValue: simulacaoService }]
    });
  });

  function criarTela() {
    const fixture = TestBed.createComponent(NovaSimulacao);
    fixture.detectChanges();
    const tela = fixture.componentInstance as any;
    const el = fixture.nativeElement as HTMLElement;
    return { fixture, tela, el };
  }

  function preencher(tela: any) {
    tela.form.setValue({
      nome: 'Maria Silva Santos',
      cpf: '529.982.247-25',
      dataNascimento: '1995-03-12',
      rendaMensal: 3500,
      valorSolicitado: 24000,
      prazoMeses: 24
    });
  }

  it('deve mostrar os erros e não chamar a API com o formulário vazio', async () => {
    const { fixture, tela, el } = criarTela();
    tela.simular();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(simulacaoService.simularCredito).not.toHaveBeenCalled();
    expect(el.querySelectorAll('form small').length).toBe(6);
  });

  it('deve enviar o CPF só com dígitos e a idade calculada', () => {
    simulacaoService.simularCredito.and.returnValue(of(criarSimulacao()));
    const { tela } = criarTela();
    preencher(tela);
    tela.simular();

    const request = simulacaoService.simularCredito.calls.mostRecent().args[0];
    expect(request.cpf).toBe('52998224725');
    expect(request.idade).toBeGreaterThanOrEqual(31);
    expect(request.prazoMeses).toBe(24);
  });

  it('deve mostrar o resultado da simulação', async () => {
    simulacaoService.simularCredito.and.returnValue(of(criarSimulacao({ status: 'REPROVADO' })));
    const { fixture, tela, el } = criarTela();
    preencher(tela);
    tela.simular();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(el.querySelector('.resultado')?.textContent).toContain('Crédito não aprovado');
    expect(tela.enviando()).toBeFalse();
  });

  it('deve avisar quando a API estiver fora do ar', () => {
    simulacaoService.simularCredito.and.returnValue(throwError(() => new HttpErrorResponse({ status: 0 })));
    const { tela } = criarTela();
    preencher(tela);
    tela.simular();

    expect(tela.erro()).toContain('Não foi possível conectar com a API');
  });

  it('deve mostrar erro genérico quando a API responder com falha', () => {
    simulacaoService.simularCredito.and.returnValue(throwError(() => new HttpErrorResponse({ status: 500 })));
    const { tela } = criarTela();
    preencher(tela);
    tela.simular();

    expect(tela.erro()).toContain('Tente novamente');
  });

  it('deve aplicar a máscara no CPF enquanto digita', () => {
    const { tela } = criarTela();
    const input = document.createElement('input');
    input.value = '52998224725';
    tela.aoDigitarCpf({ target: input } as unknown as Event);

    expect(tela.form.controls.cpf.value).toBe('529.982.247-25');
  });

  it('deve limpar o formulário e o resultado', () => {
    simulacaoService.simularCredito.and.returnValue(of(criarSimulacao()));
    const { tela } = criarTela();
    preencher(tela);
    tela.simular();
    tela.limpar();

    expect(tela.form.controls.nome.value).toBe('');
    expect(tela.resultado()).toBeNull();
  });
});
