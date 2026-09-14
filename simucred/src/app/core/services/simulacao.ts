import { isPlatformBrowser } from '@angular/common';
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimulacaoRequest } from '../models/SimulacaoRequest';
import { SimulacaoResponse } from '../models/SimulacaoResponse';

@Injectable({
  providedIn: 'root'
})
export class SimulacaoService {
  private readonly http = inject(HttpClient);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly URL_API = isPlatformBrowser(this.platformId)
    ? (window as any).env?.URL_API
    : '';

  private readonly DEFAULT_URL = `${this.URL_API}/v1`;
  private readonly PATH_SIMULACAO = '/simulacao';

  simularCredito(request: SimulacaoRequest): Observable<SimulacaoResponse> {
    return this.http.post<SimulacaoResponse>(
      `${this.DEFAULT_URL}${this.PATH_SIMULACAO}`,
      request
    );
  }
}