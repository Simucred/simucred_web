import { AbstractControl, ValidationErrors } from '@angular/forms';

export function calcularIdade(dataNascimento: string, hoje = new Date()): number {
  const nascimento = new Date(`${dataNascimento}T00:00:00`);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());
  if (aindaNaoFezAniversario) {
    idade--;
  }
  return idade;
}

export function dataNascimentoValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  const idade = calcularIdade(control.value);
  if (Number.isNaN(idade) || idade < 0 || idade > 120) {
    return { dataNascimento: true };
  }
  return null;
}
