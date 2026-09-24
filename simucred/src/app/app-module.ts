import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { environment } from '../environments/environment';
import {
  provideKeycloak,
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  createInterceptorCondition,
  IncludeBearerTokenCondition
} from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { Shell } from './layout/shell/shell';
import { Inicio } from './pages/inicio/inicio';
import { NovaSimulacao } from './pages/nova-simulacao/nova-simulacao';
import { MinhasSimulacoes } from './pages/minhas-simulacoes/minhas-simulacoes';
import { DetalheSimulacao } from './pages/minhas-simulacoes/detalhe-simulacao/detalhe-simulacao';
import { StatusBadge } from './shared/status-badge/status-badge';

registerLocaleData(localePt);

const isBrowser = typeof window !== 'undefined';
const apiUrl = isBrowser ? (environment.apiUrl ?? '') : '';
const escapedApiUrl = apiUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const bearerCondition: IncludeBearerTokenCondition = createInterceptorCondition({
  urlPattern: escapedApiUrl ? new RegExp(`^${escapedApiUrl}(/.*)?$`) : /^$/,
  bearerPrefix: 'Bearer'
});

@NgModule({
  declarations: [
    App,
    Shell,
    Inicio,
    NovaSimulacao,
    MinhasSimulacoes,
    DetalheSimulacao,
    StatusBadge
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    provideHttpClient(withFetch(), withInterceptors([includeBearerTokenInterceptor])),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [bearerCondition]
    },
    ...(typeof window !== 'undefined' && environment.authEnabled ? [
      provideKeycloak({
        config: environment.keycloak,
        initOptions: {
          onLoad: 'login-required',
          checkLoginIframe: false
        }
      })
    ] : [
      { provide: Keycloak, useValue: { logout: () => { } } }
    ])
  ],
  bootstrap: [App]
})
export class AppModule { }