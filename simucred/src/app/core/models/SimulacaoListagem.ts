import { StatusSimulacao } from "./enums/StatusSimulacao";

export interface SimulacaoListagem {
  id: string;
  dataSimulacao: string;
  valorSolicitado: number;
  prazoMeses: number;
  status: StatusSimulacao;
  nome: string;
  cpf: string;
  idade: number;
  rendaMensal: number;
  justificativaIa: string;
}