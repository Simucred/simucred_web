import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SimulacaoService } from '../../core/services/simulacao';
import { UsuarioService } from '../../core/services/usuario';
import { SimulacaoListagem } from '../../core/models/SimulacaoListagem';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.html',
  standalone: false,
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  private readonly simulacaoService = inject(SimulacaoService);

  protected readonly primeiroNome = inject(UsuarioService).primeiroNome;
  protected readonly resumo = this.simulacaoService.resumo;
  protected readonly recentes = computed(() =>
    this.simulacaoService.simulacoes().slice(0, 5)
  );
  protected readonly selecionada = signal<SimulacaoListagem | null>(null);
  protected readonly percentualAprovacao = computed(() => Math.min(100, Math.max(0, this.resumo().taxaAprovacao)));
  // Formato pt-BR com até 2 casas: 100 -> "100", 66.666 -> "66,67"
  protected readonly taxaAprovacaoFormatada = computed(() =>
    this.resumo().taxaAprovacao.toLocaleString('pt-BR', { maximumFractionDigits: 2 })
  );
  protected readonly circunferencia = 251.2;
  protected readonly arcoAprovacao = computed(() => `${this.percentualAprovacao() / 100 * this.circunferencia} ${this.circunferencia}`);

  ngOnInit(): void {
    this.simulacaoService.carregarDashboard();
  }

  abrirDetalhes(simulacao: SimulacaoListagem): void {
    this.selecionada.set(simulacao);
  }

  fecharDetalhes(): void {
    this.selecionada.set(null);
  }
}
