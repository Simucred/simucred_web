export type StatusSimulacao = 'APROVADO' | 'REPROVADO' | 'EM_ANALISE';

export interface SimulacaoResponse {
  id: string;
  cpf: string;
  nome: string;
  valorSolicitado: number;
  status: StatusSimulacao;
  justificativaIa: string;
  dataSimulacao: string;
}

// Dados que o front guarda junto com a resposta, porque a API ainda não devolve
// renda e prazo no response.
export interface Simulacao extends SimulacaoResponse {
  idade: number;
  rendaMensal: number;
  prazoMeses: number;
}
