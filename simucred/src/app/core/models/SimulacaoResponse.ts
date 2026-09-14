export interface SimulacaoResponse {
  id: number;
  cpf: string;
  nome: string;
  valorSolicitado: number;
  status: string;
  justificativaIa: string;
  dataSimulacao: string;
}