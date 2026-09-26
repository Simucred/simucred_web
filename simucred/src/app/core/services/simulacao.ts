import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SimulacaoRequest } from '../models/SimulacaoRequest';
import { Simulacao, SimulacaoResponse } from '../models/SimulacaoResponse';
import { SIMULACOES_MOCK } from './simulacao.mock';
import { SimulacaoListagem } from '../models/SimulacaoListagem';
import { ResumoSimulacao } from '../models/ResumoSimulacao';

const TAXA_JUROS_MENSAL_MOCK = 0.025;
const PERCENTUAL_MAXIMO_COMPROMETIMENTO_MOCK = 0.30;

@Injectable({
  providedIn: 'root'
})
export class SimulacaoService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly DEFAULT_URL = environment.apiUrl ?? '';
  private readonly PATH_SIMULACAO = '/simulacoes';

  private readonly historico = signal<Simulacao[]>(environment.mockApi ? SIMULACOES_MOCK : []);

  readonly simulacoes = signal<SimulacaoListagem[]>([]);
  readonly resumo = signal<ResumoSimulacao>({
    total: 0, aprovadas: 0, reprovadas: 0, emAnalise: 0, taxaAprovacao: 0, valorMedio: 0
  });

  carregarDashboard(): void {
    if (!environment.mockApi && isPlatformBrowser(this.platformId)) {
      this.http.get<ResumoSimulacao>(`${this.DEFAULT_URL}${this.PATH_SIMULACAO}/resumo`)
        .subscribe({
          next: dados => this.resumo.set(dados),
          error: err => console.error('Erro ao carregar resumo', err)
        });

      this.http.get<SimulacaoListagem[]>(`${this.DEFAULT_URL}${this.PATH_SIMULACAO}`)
        .subscribe({
          next: dados => this.simulacoes.set(dados),
          error: err => console.error('Erro ao carregar simulacoes', err)
        });
    }
  }

  simularCredito(request: SimulacaoRequest): Observable<Simulacao> {
    const resposta$ = environment.mockApi
      ? this.simularMock(request)
      : this.http.post<SimulacaoResponse>(`${this.DEFAULT_URL}${this.PATH_SIMULACAO}`, request);

    return resposta$.pipe(
      tap((simulacao) => {
        this.historico.update((lista) => [simulacao, ...lista]);

        if (!environment.mockApi) {
          this.carregarDashboard();
        }
      })
    );
  }

  buscarPorId(id: string): Simulacao | undefined {
    return this.historico().find((s) => s.id === id);
  }

  private simularMock(request: SimulacaoRequest): Observable<SimulacaoResponse> {
    const idade = this.calcularIdadeMock(request.dataNascimento);
    const valorParcela = this.calcularParcelaPriceMock(request.valorSolicitado, TAXA_JUROS_MENSAL_MOCK, request.prazoMeses);
    const limiteComprometimento = request.rendaMensal * PERCENTUAL_MAXIMO_COMPROMETIMENTO_MOCK;
    const aprovado = valorParcela <= limiteComprometimento;
    const cpf = request.cpf;
    const totalEstimado = valorParcela * request.prazoMeses;
    const totalJuros = Math.max(0, Math.round((totalEstimado - request.valorSolicitado) * 100) / 100);
    const percentualComprometimento = Math.round((valorParcela / request.rendaMensal) * 100);

    return of<SimulacaoResponse>({
      id: crypto.randomUUID(),
      cpf: `${cpf.substring(0, 3)}.***.***-${cpf.substring(9, 11)}`,
      nome: request.nome,
      idade,
      rendaMensal: request.rendaMensal,
      valorSolicitado: request.valorSolicitado,
      prazoMeses: request.prazoMeses,
      valorParcela,
      taxaJurosMensal: TAXA_JUROS_MENSAL_MOCK,
      status: aprovado ? 'APROVADO' : 'REPROVADO',
      justificativaIa: aprovado
        ? `Crédito aprovado: a parcela de R$ ${valorParcela.toFixed(2)} compromete ${percentualComprometimento}% da renda, dentro do limite de 30%.`
        : `Crédito reprovado: a parcela de R$ ${valorParcela.toFixed(2)} compromete ${percentualComprometimento}% da renda declarada, superando o teto de 30%.`,
      dataSimulacao: new Date().toISOString(),
      analiseIA: {
        textoExplicativo: aprovado
          ? `Parabéns ${request.nome}! Sua proposta foi aprovada com sucesso. A parcela estimada de R$ ${valorParcela.toFixed(2)} representa ${percentualComprometimento}% da sua renda líquida mensal de R$ ${request.rendaMensal.toFixed(2)}, garantindo conforto e segurança no seu orçamento.`
          : `Olá ${request.nome}, sua simulação não atingiu os critérios de aprovação neste momento. O valor da parcela de R$ ${valorParcela.toFixed(2)} representaria ${percentualComprometimento}% dos seus rendimentos, ultrapassando a margem máxima de segurança de 30%. Experimente estender o prazo ou reduzir o montante.`,
        dadosGrafico: [
          { label: 'Valor Solicitado (Principal)', valor: request.valorSolicitado },
          { label: 'Total Estimado de Juros', valor: totalJuros }
        ]
      }
    }).pipe(delay(600));
  }

  private calcularIdadeMock(dataNascimento: string): number {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const aindaNaoFezAniversario =
      hoje.getMonth() < nascimento.getMonth() ||
      (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
    if (aindaNaoFezAniversario) idade--;
    return idade;
  }

  private calcularParcelaPriceMock(valorPresente: number, taxaMensal: number, numeroParcelas: number): number {
    const fatorPotencia = Math.pow(1 + taxaMensal, numeroParcelas);
    const fator = (taxaMensal * fatorPotencia) / (fatorPotencia - 1);
    return Math.round(valorPresente * fator * 100) / 100;
  }
}
