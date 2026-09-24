import { Component, computed, input } from '@angular/core';
import { StatusSimulacao } from '../../core/models/SimulacaoResponse';

const ROTULOS: Record<StatusSimulacao, string> = {
  APROVADO: 'Aprovada',
  REPROVADO: 'Reprovada',
  EM_ANALISE: 'Em análise'
};

@Component({
  selector: 'app-status-badge',
  standalone: false,
  template: `<span class="badge" [class]="classe()">{{ rotulo() }}</span>`,
  styles: `
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
    }
    .aprovado { background: var(--green-50); color: var(--green-600); }
    .reprovado { background: var(--red-50); color: var(--red-600); }
    .em_analise { background: var(--amber-50); color: var(--amber-600); }
  `
})
export class StatusBadge {
  readonly status = input.required<StatusSimulacao>();

  protected readonly rotulo = computed(() => ROTULOS[this.status()] ?? this.status());
  protected readonly classe = computed(() => `badge ${this.status().toLowerCase()}`);
}
