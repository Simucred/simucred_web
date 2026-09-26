import { Component, inject, signal } from '@angular/core';
import { SimulacaoService } from '../../core/services/simulacao';
import { SimulacaoListagem } from '../../core/models/SimulacaoListagem';
import { SimulacaoResponse } from '../../core/models/SimulacaoResponse';

@Component({
  selector: 'app-minhas-simulacoes',
  templateUrl: './minhas-simulacoes.html',
  standalone: false,
  styleUrl: './minhas-simulacoes.css'
})
export class MinhasSimulacoes {
  private readonly simulacaoService = inject(SimulacaoService);

  protected readonly simulacoes = this.simulacaoService.simulacoes;
  protected readonly resumo = this.simulacaoService.resumo;
  protected readonly selecionada = signal<SimulacaoListagem | null>(null);

  percentual(parte: number): number {
    const total = this.resumo().total;
    return total ? Math.round((parte / total) * 100) : 0;
  }

  abrirDetalhes(simulacao: SimulacaoListagem) {
    this.selecionada.set(simulacao);
  }

  fecharDetalhes() {
    this.selecionada.set(null);
  }
}
