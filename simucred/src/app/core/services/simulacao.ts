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
          error: err => console.error('Erro ao carregar simulações', err)
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
        ? 'Crédito aprovado: a renda mensal comporta a parcela estimada.'
        : 'Crédito reprovado: parcela compromete mais de 30% da renda declarada.',
      dataSimulacao: new Date().toISOString()
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