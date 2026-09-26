export interface SimulacaoRequest {
  cpf: string;
  nome: string;
  dataNascimento: string;
  rendaMensal: number;
  valorSolicitado: number;
  prazoMeses: number;
}