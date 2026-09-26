import { StatusSimulacao } from './enums/StatusSimulacao';

export interface DadoGrafico {
  label: string;
  valor: number;
}

export interface GeminiAnaliseResponse {
  textoExplicativo: string;
  dadosGrafico: DadoGrafico[];
}

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
  analiseIA?: GeminiAnaliseResponse;
}

export type Simulacao = SimulacaoResponse;
