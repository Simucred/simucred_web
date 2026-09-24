import { Component, computed, input, output } from '@angular/core';
import { Simulacao } from '../../../core/models/SimulacaoResponse';

// Limite de comprometimento de renda usado pelo motor de regras do backend.
const LIMITE_COMPROMETIMENTO = 30;

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
  readonly simulacao = input.required<Simulacao>();
  readonly fechar = output<void>();

  protected readonly limite = LIMITE_COMPROMETIMENTO;

  // Parcela estimada sem juros, igual ao cálculo atual da API.
  protected readonly parcela = computed(
    () => this.simulacao().valorSolicitado / this.simulacao().prazoMeses
  );

  protected readonly comprometimento = computed(() => {
    const renda = this.simulacao().rendaMensal;
    return renda ? Math.round((this.parcela() / renda) * 100) : 0;
  });

  protected readonly dentroDoLimite = computed(() => this.comprometimento() <= LIMITE_COMPROMETIMENTO);
}
