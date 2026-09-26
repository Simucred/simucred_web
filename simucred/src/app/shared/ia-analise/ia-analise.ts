import { Component, computed, input } from '@angular/core';
import { GeminiAnaliseResponse, DadoGrafico } from '../../core/models/SimulacaoResponse';
import { SimulacaoListagem } from '../../core/models/SimulacaoListagem';
import { StatusSimulacao } from '../../core/models/enums/StatusSimulacao';

const LIMITE_COMPROMETIMENTO = 30;
const PRAZO_MAXIMO = 360;
const TAXA_PADRAO = 0.025;

@Component({ selector: 'app-ia-analise', standalone: false, templateUrl: './ia-analise.html', styleUrl: './ia-analise.css' })
export class IaAnalise {
  readonly analise = input<GeminiAnaliseResponse | undefined>();
  readonly justificativa = input<string | undefined>();
  readonly valorSolicitado = input.required<number>();
  readonly prazoMeses = input.required<number>();
  readonly valorParcela = input<number | undefined>();
  readonly taxaJurosMensal = input<number | undefined>();
  readonly rendaMensal = input.required<number>();
  readonly status = input.required<StatusSimulacao>();
  readonly historico = input<SimulacaoListagem[]>([]);

  protected readonly parcelaCalculada = computed(() => {
    const parcela = this.valorParcela();
    return parcela && parcela > 0 ? parcela : this.calcularParcela(this.valorSolicitado(), this.prazoMeses() || 1);
  });
  protected readonly comprometimento = computed(() => {
    const renda = this.rendaMensal();
    return renda > 0 ? (this.parcelaCalculada() / renda) * 100 : 0;
  });
  protected readonly dentroDoLimite = computed(() => this.comprometimento() <= LIMITE_COMPROMETIMENTO);

  protected readonly textoExplicativo = computed(() => {
    const parcela = this.parcelaCalculada();
    const percentual = this.comprometimento();
    const percentualTexto = percentual.toFixed(1).replace('.', ',');
    if (this.status() === 'APROVADO') {
      return `Crédito aprovado: a parcela de ${this.moeda(parcela)} compromete ${percentualTexto}% da renda mensal de ${this.moeda(this.rendaMensal())}, permanecendo dentro do limite prudencial de ${LIMITE_COMPROMETIMENTO}%.`;
    }
    if (this.status() === 'REPROVADO') {
      if (this.dentroDoLimite()) {
        return `A proposta foi reprovada pelo motor de crédito, mas os dados exibidos mostram comprometimento de ${percentualTexto}%, dentro do limite de ${LIMITE_COMPROMETIMENTO}%. Consulte os demais critérios da análise antes de tomar uma decisão.`;
      }
      return `Crédito não aprovado porque a parcela de ${this.moeda(parcela)} compromete ${percentualTexto}% da renda mensal, ultrapassando o limite permitido de ${LIMITE_COMPROMETIMENTO}%.`;
    }
    return `A proposta está em análise. A parcela estimada de ${this.moeda(parcela)} representa ${percentualTexto}% da renda mensal; o resultado final ainda depende da conclusão do motor de crédito.`;
  });

  protected readonly totalEstimado = computed(() => this.parcelaCalculada() * this.prazoMeses());
  protected readonly totalJuros = computed(() => Math.max(0, this.totalEstimado() - this.valorSolicitado()));
  protected readonly taxa = computed(() => this.taxaJurosMensal() ?? TAXA_PADRAO);

  protected readonly alternativa = computed(() => {
    if (this.status() !== 'REPROVADO' || this.dentroDoLimite()) return null;
    const limiteParcela = this.rendaMensal() * (LIMITE_COMPROMETIMENTO / 100);
    let prazo = this.prazoMeses();
    while (prazo < PRAZO_MAXIMO && this.calcularParcela(this.valorSolicitado(), prazo) > limiteParcela) prazo++;
    if (prazo <= PRAZO_MAXIMO && this.calcularParcela(this.valorSolicitado(), prazo) <= limiteParcela) {
      return { titulo: 'Aumentar o prazo', descricao: `Em aproximadamente ${prazo} meses, a parcela cairia para ${this.moeda(this.calcularParcela(this.valorSolicitado(), prazo))}, dentro do limite de ${this.moeda(limiteParcela)}.`, detalhe: `${prazo - this.prazoMeses()} meses a mais no prazo` };
    }
    const valorMaximo = limiteParcela / this.fatorPrice(this.prazoMeses());
    return { titulo: 'Reduzir o valor solicitado', descricao: `Para manter ${this.prazoMeses()} meses, um valor próximo de ${this.moeda(valorMaximo)} geraria parcela de até ${this.moeda(limiteParcela)}.`, detalhe: 'Parcela ajustada ao limite de renda' };
  });

  protected readonly insights = computed(() => {
    const historico = this.historico();
    const total = historico.length;
    const aprovadas = historico.filter(item => item.status === 'APROVADO').length;
    const reprovadas = historico.filter(item => item.status === 'REPROVADO').length;
    return { total, aprovadas, reprovadas, taxaAprovacao: total ? Math.round((aprovadas / total) * 100) : 0 };
  });

  protected readonly dadosGrafico = computed<DadoGrafico[]>(() => this.analise()?.dadosGrafico?.length ? this.analise()!.dadosGrafico : [
    { label: 'Capital solicitado', valor: this.valorSolicitado() }, { label: 'Custo em juros', valor: this.totalJuros() }
  ]);
  protected readonly somaValoresGrafico = computed(() => this.dadosGrafico().reduce((total, item) => total + Math.max(0, item.valor || 0), 0) || 1);
  protected readonly percentualPrincipal = computed(() => this.totalEstimado() > 0 ? Math.min(100, Math.round(this.valorSolicitado() / this.totalEstimado() * 100)) : 100);
  protected readonly percentualJuros = computed(() => Math.max(0, 100 - this.percentualPrincipal()));
  private readonly CIRCUNFERENCIA = 251.327;
  protected readonly strokeDashPrincipal = computed(() => `${this.percentualPrincipal() / 100 * this.CIRCUNFERENCIA} ${this.CIRCUNFERENCIA}`);
  protected readonly strokeDashJuros = computed(() => `${this.percentualJuros() / 100 * this.CIRCUNFERENCIA} ${this.CIRCUNFERENCIA}`);
  protected readonly strokeOffsetJuros = computed(() => -(this.percentualPrincipal() / 100 * this.CIRCUNFERENCIA));

  protected moeda(valor: number): string { return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor); }
  private fatorPrice(prazo: number): number {
    const taxa = this.taxa();
    if (!taxa) return 1 / Math.max(1, prazo);
    const potencia = Math.pow(1 + taxa, prazo);
    return taxa * potencia / (potencia - 1);
  }
  private calcularParcela(valor: number, prazo: number): number { return valor * this.fatorPrice(prazo); }
}
