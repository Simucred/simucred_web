import { StatusSimulacao } from './enums/StatusSimulacao';
import { GeminiAnaliseResponse } from './SimulacaoResponse';

export interface SimulacaoListagem {
  id: string;
  dataSimulacao: string;
  valorSolicitado: number;
  prazoMeses: number;
  valorParcela?: number;
  taxaJurosMensal?: number;
  status: StatusSimulacao;
  nome: string;
  cpf: string;
  idade: number;
  rendaMensal: number;
  justificativaIa: string;
  analiseIA?: GeminiAnaliseResponse;
}
