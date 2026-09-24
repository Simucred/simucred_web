import { Simulacao } from '../core/models/SimulacaoResponse';

export function criarSimulacao(dados: Partial<Simulacao> = {}): Simulacao {
  return {
    id: 'b0f3c1e2-1111-4000-8000-000000000001',
    cpf: '529.***.***-25',
    nome: 'Maria Silva Santos',
    idade: 31,
    rendaMensal: 3500,
    valorSolicitado: 24000,
    prazoMeses: 24,
    valorParcela: 1284.15, // Valor adicionado para satisfazer a interface atualizada
    taxaJurosMensal: 0.025, // Valor adicionado para satisfazer a interface atualizada
    status: 'APROVADO',
    justificativaIa: 'Crédito aprovado: a renda mensal comporta a parcela estimada.',
    dataSimulacao: '2026-09-23T10:00:00',
    ...dados
  };
}
