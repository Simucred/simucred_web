import { Component, computed, input, output } from '@angular/core';
import { SimulacaoListagem } from '../../../core/models/SimulacaoListagem';

const LIMITE_COMPROMETIMENTO = 30;
const TAXA_JUROS_MENSAL_PADRAO = 0.025;

@Component({
  selector: 'app-detalhe-simulacao',
  templateUrl: './detalhe-simulacao.html',
  standalone: false,
  styleUrl: './detalhe-simulacao.css',
  host: {
    '(document:keydown.escape)': 'fechar.emit()'
  }
})
export class DetalheSimulacao {
  readonly simulacao = input.required<SimulacaoListagem>();
  readonly historico = input<SimulacaoListagem[]>([]);
  readonly fechar = output<void>();

  protected readonly limite = LIMITE_COMPROMETIMENTO;

  protected readonly parcela = computed(() => {
    const simulacao = this.simulacao();
    if (simulacao.valorParcela && simulacao.valorParcela > 0) return simulacao.valorParcela;

    // Registros antigos não tinham a parcela persistida. Recalcula com a mesma
    // Tabela Price usada na nova simulação, preservando a coerência histórica.
    const taxa = simulacao.taxaJurosMensal ?? TAXA_JUROS_MENSAL_PADRAO;
    const potencia = Math.pow(1 + taxa, simulacao.prazoMeses);
    const fator = taxa * potencia / (potencia - 1);
    return simulacao.valorSolicitado * fator;
  });

  protected readonly comprometimento = computed(() => {
    const renda = this.simulacao().rendaMensal;
    return renda ? Math.round((this.parcela() / renda) * 100) : 0;
  });

  protected readonly dentroDoLimite = computed(() => this.comprometimento() <= LIMITE_COMPROMETIMENTO);
}
