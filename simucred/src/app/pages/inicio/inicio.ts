import { Component, computed, inject, OnInit } from '@angular/core';
import { SimulacaoService } from '../../core/services/simulacao';
import { UsuarioService } from '../../core/services/usuario';

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

  ngOnInit(): void {
    this.simulacaoService.carregarDashboard();
  }
}