import { FormControl } from '@angular/forms';
import { calcularIdade, dataNascimentoValidator } from './idade';

describe('idade', () => {
  const hoje = new Date(2026, 8, 23);

  it('deve calcular a idade de quem ja fez aniversario no ano', () => {
    expect(calcularIdade('1995-03-12', hoje)).toBe(31);
  });

  it('deve calcular a idade de quem ainda nao fez aniversario no ano', () => {
    expect(calcularIdade('1995-12-01', hoje)).toBe(30);
  });

  it('deve recusar data no futuro', () => {
    expect(dataNascimentoValidator(new FormControl('2999-01-01'))).toEqual({ dataNascimento: true });
  });
});
