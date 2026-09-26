import { SimulacaoResponse } from '../models/SimulacaoResponse';

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
    taxaJurosMensal: 0.025,
    status: 'APROVADO',
    justificativaIa: 'Crédito aprovado: a renda mensal comporta a parcela estimada dentro do limite prudencial de 30%.',
    dataSimulacao: '2026-09-16T14:32:00',
    analiseIA: {
      textoExplicativo: 'Parabéns! Sua proposta foi aprovada. A parcela de R$ 450,50 representa apenas 13% da sua renda de R$ 3.500,00, mantendo uma excelente margem de segurança financeira.',
      dadosGrafico: [
        { label: 'Valor Solicitado (Principal)', valor: 25000 },
        { label: 'Total Estimado de Juros', valor: 7436 }
      ]
    }
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
    taxaJurosMensal: 0.025,
    status: 'REPROVADO',
    justificativaIa: 'Crédito reprovado: parcela compromete mais de 30% da renda declarada.',
    dataSimulacao: '2026-09-14T13:17:00',
    analiseIA: {
      textoExplicativo: 'Infelizmente a simulação não foi aprovada neste momento. A parcela de R$ 350,00 comprometeria 50% da sua renda mensal de R$ 700,00, superando o limite máximo permitido de 30%. Recomendamos solicitar um valor menor ou estender o prazo.',
      dadosGrafico: [
        { label: 'Valor Solicitado (Principal)', valor: 12500 },
        { label: 'Total Estimado de Juros', valor: 4300 }
      ]
    }
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
    taxaJurosMensal: 0.025,
    status: 'APROVADO',
    justificativaIa: 'Crédito aprovado: a renda mensal comporta a parcela estimada.',
    dataSimulacao: '2026-09-12T11:03:00',
    analiseIA: {
      textoExplicativo: 'Proposta aprovada com sucesso! Seu comprometimento de renda ficou em apenas 7%, demonstrando alta solidez para honrar o financiamento.',
      dadosGrafico: [
        { label: 'Valor Solicitado (Principal)', valor: 18000 },
        { label: 'Total Estimado de Juros', valor: 4800 }
      ]
    }
  }
];
