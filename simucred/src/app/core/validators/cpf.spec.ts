import { FormControl } from '@angular/forms';
import { cpfValidator, cpfValido, formatarCpf } from './cpf';

describe('cpf', () => {
  it('deve aceitar CPF valido com ou sem mascara', () => {
    expect(cpfValido('52998224725')).toBeTrue();
    expect(cpfValido('529.982.247-25')).toBeTrue();
  });

  it('deve recusar CPF com digito verificador errado', () => {
    expect(cpfValido('52998224724')).toBeFalse();
  });

  it('deve recusar CPF com todos os digitos iguais ou tamanho errado', () => {
    expect(cpfValido('11111111111')).toBeFalse();
    expect(cpfValido('123')).toBeFalse();
  });

  it('deve formatar o CPF enquanto digita', () => {
    expect(formatarCpf('529')).toBe('529');
    expect(formatarCpf('5299822')).toBe('529.982.2');
    expect(formatarCpf('52998224725')).toBe('529.982.247-25');
  });

  it('validator deve retornar erro apenas para CPF invalido', () => {
    expect(cpfValidator(new FormControl(''))).toBeNull();
    expect(cpfValidator(new FormControl('529.982.247-25'))).toBeNull();
    expect(cpfValidator(new FormControl('000.000.000-00'))).toEqual({ cpf: true });
  });
});
