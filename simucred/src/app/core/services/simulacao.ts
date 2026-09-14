import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimulacaoRequest } from '../models/SimulacaoRequest';
import { SimulacaoResponse } from '../models/SimulacaoResponse';

@Injectable({
  providedIn: 'root'
})
export class SimulacaoService {
  private http = inject(HttpClient);
  private URL_API = (window as any).env?.URL_API;
  private readonly DEFAULT_URL = `${this.URL_API}/v1`;
  private PATH_SIMULACAO = '/simulacao';

  simularCredito(request: SimulacaoRequest): Observable<SimulacaoResponse> {
    return this.http.post<SimulacaoResponse>(`${this.DEFAULT_URL}${this.PATH_SIMULACAO}`, request);
  }
}