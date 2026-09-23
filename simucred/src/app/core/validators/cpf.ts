import { AbstractControl, ValidationErrors } from '@angular/forms';

export function somenteDigitos(valor: string): string {
  return (valor ?? '').replace(/\D/g, '');
}

export function cpfValido(cpf: string): boolean {
  const digitos = somenteDigitos(cpf);
  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) {
    return false;
  }

  const calcularDigito = (tamanho: number) => {
    let soma = 0;
    for (let i = 0; i < tamanho; i++) {
      soma += Number(digitos[i]) * (tamanho + 1 - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  return calcularDigito(9) === Number(digitos[9]) && calcularDigito(10) === Number(digitos[10]);
}

export function cpfValidator(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null;
  }
  return cpfValido(control.value) ? null : { cpf: true };
}

export function formatarCpf(valor: string): string {
  const d = somenteDigitos(valor).slice(0, 11);
  return d
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d{1,2})$/, '.$1-$2');
}
