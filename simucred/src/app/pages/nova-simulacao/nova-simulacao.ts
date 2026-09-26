import { Component, inject, signal } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SimulacaoService } from '../../core/services/simulacao';
import { Simulacao } from '../../core/models/SimulacaoResponse';
import { cpfValidator, formatarCpf, somenteDigitos } from '../../core/validators/cpf';
import { dataNascimentoValidator } from '../../core/validators/idade';

@Component({
  selector: 'app-nova-simulacao',
  templateUrl: './nova-simulacao.html',
  standalone: false,
  styleUrl: './nova-simulacao.css'
})
export class NovaSimulacao {
  private readonly fb = inject(FormBuilder);
  private readonly simulacaoService = inject(SimulacaoService);

  protected readonly prazos = [12, 24, 36, 48, 60, 72];
  protected readonly enviando = signal(false);
  protected readonly erro = signal<string | null>(null);
  protected readonly resultado = signal<Simulacao | null>(null);

  protected readonly form = this.fb.nonNullable.group({
    nome: ['', [Validators.required, Validators.minLength(3)]],
    cpf: ['', [Validators.required, cpfValidator]],
    dataNascimento: ['', [Validators.required, dataNascimentoValidator]],
    rendaMensal: [null as number | null, [Validators.required, Validators.min(1)]],
    valorSolicitado: [null as number | null, [Validators.required, Validators.min(100)]],
    prazoMeses: [null as number | null, Validators.required]
  });

  invalido(campo: keyof typeof this.form.controls): boolean {
    const control = this.form.controls[campo];
    return control.invalid && (control.touched || control.dirty);
  }

  aoDigitarCpf(evento: Event) {
    const input = evento.target as HTMLInputElement;
    this.form.controls.cpf.setValue(formatarCpf(input.value));
  }

  limpar() {
    this.form.reset();
    this.resultado.set(null);
    this.erro.set(null);
  }

  simular() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    this.enviando.set(true);
    this.erro.set(null);

    this.simulacaoService
      .simularCredito({
        nome: valores.nome.trim(),
        cpf: somenteDigitos(valores.cpf),
        dataNascimento: valores.dataNascimento,
        rendaMensal: Number(valores.rendaMensal),
        valorSolicitado: Number(valores.valorSolicitado),
        prazoMeses: Number(valores.prazoMeses)
      })
      .subscribe({
        next: (simulacao) => {
          this.resultado.set(simulacao);
          this.enviando.set(false);
        },
        error: (erro: HttpErrorResponse) => {
          this.erro.set(
            erro.status === 0
              ? 'Não foi possível conectar com a API. Verifique se o backend está rodando.'
              : 'Não foi possível realizar a simulação. Tente novamente.'
          );
          this.enviando.set(false);
        }
      });
  }
}