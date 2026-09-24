import { StatusSimulacao } from "./enums/StatusSimulacao";

export interface SimulacaoResponse {
  id: string;
  cpf: string;
  nome: string;
  idade: number;
  rendaMensal: number;
  valorSolicitado: number;
  prazoMeses: number;
  valorParcela: number;
  taxaJurosMensal: number;
  status: StatusSimulacao;
  justificativaIa: string;
  dataSimulacao: string;
}

// Agora a API já devolve todos os campos — Simulacao é só um alias
export type Simulacao = SimulacaoResponse;