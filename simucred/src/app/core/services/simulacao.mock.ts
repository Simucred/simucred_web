import { SimulacaoResponse } from '../models/SimulacaoResponse';

// Dados de exemplo usados só no modo mock (npm run start:mock).
export const SIMULACOES_MOCK: SimulacaoResponse[] = [
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    cpf: '123.***.***-09',
    nome: 'Maria Silva Santos',
    idade: 31,
    rendaMensal: 3500,
    valorSolicitado: 25000,
    prazoMeses: 72,
    valorParcela: 450.50,
    taxaJurosMensal: 1.5,
    status: 'APROVADO',
    justificativaIa: 'Crédito aprovado: a renda mensal comporta a parcela estimada.',
    dataSimulacao: '2026-09-16T14:32:00'
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    cpf: '111.***.***-44',
    nome: 'João Pereira Lima',
    idade: 27,
    rendaMensal: 700,
    valorSolicitado: 12500,
    prazoMeses: 48,
    valorParcela: 350.00,
    taxaJurosMensal: 1.5,
    status: 'REPROVADO',
    justificativaIa: 'Crédito reprovado: parcela compromete mais de 30% da renda declarada.',
    dataSimulacao: '2026-09-14T13:17:00'
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-000000000003',
    cpf: '999.***.***-66',
    nome: 'Ana Costa Oliveira',
    idade: 42,
    rendaMensal: 5200,
    valorSolicitado: 18000,
    prazoMeses: 60,
    valorParcela: 380.00,
    taxaJurosMensal: 1.5,
    status: 'APROVADO',
    justificativaIa: 'Crédito aprovado: a renda mensal comporta a parcela estimada.',
    dataSimulacao: '2026-09-12T11:03:00'
  },
  {
    id: 'a1b2c3d4-0004-4000-8000-000000000004',
    cpf: '555.***.***-22',
    nome: 'Carlos Mendes Rocha',
    idade: 23,
    rendaMensal: 600,
    valorSolicitado: 8500,
    prazoMeses: 36,
    valorParcela: 290.00,
    taxaJurosMensal: 1.5,
    status: 'REPROVADO',
    justificativaIa: 'Crédito reprovado: parcela compromete mais de 30% da renda declarada.',
    dataSimulacao: '2026-09-10T09:24:00'
  },
  {
    id: 'a1b2c3d4-0005-4000-8000-000000000005',
    cpf: '222.***.***-55',
    nome: 'Fernanda Souza Alves',
    idade: 35,
    rendaMensal: 6800,
    valorSolicitado: 32000,
    prazoMeses: 72,
    valorParcela: 550.00,
    taxaJurosMensal: 1.5,
    status: 'APROVADO',
    justificativaIa: 'Crédito aprovado: a renda mensal comporta a parcela estimada.',
    dataSimulacao: '2026-09-08T16:45:00'
  }
];