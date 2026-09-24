import { isPlatformBrowser } from '@angular/common';
import { Injectable, computed, inject, PLATFORM_ID, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, delay, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SimulacaoRequest } from '../models/SimulacaoRequest';
import { Simulacao, SimulacaoResponse } from '../models/SimulacaoResponse';
import { SIMULACOES_MOCK } from './simulacao.mock';

@Injectable({
  providedIn: 'root'
})
export class SimulacaoService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly URL_API = isPlatformBrowser(this.platformId)
    ? (window as any).env?.URL_API
    : '';

  private readonly DEFAULT_URL = `${this.URL_API}/v1`;
  private readonly PATH_SIMULACAO = '/simulacoes';

  // A API ainda não tem GET de simulações, então o histórico fica em memória.
  // Quando o endpoint existir, trocar por uma chamada HTTP.
  private readonly historico = signal<Simulacao[]>(environment.mockApi ? SIMULACOES_MOCK : []);

  readonly simulacoes = computed(() =>
    [...this.historico()].sort((a, b) => b.dataSimulacao.localeCompare(a.dataSimulacao))
  );

  readonly resumo = computed(() => {
    const lista = this.historico();
    const total = lista.length;
    const aprovadas = lista.filter((s) => s.status === 'APROVADO').length;
    const reprovadas = lista.filter((s) => s.status === 'REPROVADO').length;
    const emAnalise = lista.filter((s) => s.status === 'EM_ANALISE').length;
    const valorMedio = total ? lista.reduce((soma, s) => soma + s.valorSolicitado, 0) / total : 0;
    return {
      total,
      aprovadas,
      reprovadas,
      emAnalise,
      valorMedio,
      taxaAprovacao: total ? Math.round((aprovadas / total) * 100) : 0
    };
  });

  simularCredito(request: SimulacaoRequest): Observable<Simulacao> {
    const resposta$ = environment.mockApi
      ? this.simularMock(request)
      : this.http.post<SimulacaoResponse>(`${this.DEFAULT_URL}${this.PATH_SIMULACAO}`, request);

    return resposta$.pipe(
      map((resposta) => ({
        ...resposta,
        idade: request.idade,
        rendaMensal: request.rendaMensal,
        prazoMeses: request.prazoMeses
      })),
      tap((simulacao) => this.historico.update((lista) => [simulacao, ...lista]))
    );
  }

  buscarPorId(id: string): Simulacao | undefined {
    return this.historico().find((s) => s.id === id);
  }

  // Mesma regra do SimulacaoService do backend: a renda precisa ser pelo menos
  // 3x a parcela (parcela até 30% da renda).
  private simularMock(request: SimulacaoRequest): Observable<SimulacaoResponse> {
    const parcela = request.valorSolicitado / request.prazoMeses;
    const aprovado = request.rendaMensal >= parcela * 3;
    const cpf = request.cpf;
    return of<SimulacaoResponse>({
      id: crypto.randomUUID(),
      cpf: `${cpf.substring(0, 3)}.***.***-${cpf.substring(9, 11)}`,
      nome: request.nome,
      valorSolicitado: request.valorSolicitado,
      status: aprovado ? 'APROVADO' : 'REPROVADO',
      justificativaIa: aprovado
        ? 'Crédito aprovado: a renda mensal comporta a parcela estimada.'
        : 'Crédito reprovado: parcela compromete mais de 30% da renda declarada.',
      dataSimulacao: new Date().toISOString()
    }).pipe(delay(600));
  }
}
