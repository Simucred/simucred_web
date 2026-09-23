import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { environment } from '../environments/environment';
import {
  provideKeycloak,
  includeBearerTokenInterceptor,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG
} from 'keycloak-angular';
import Keycloak from 'keycloak-js';
import { Shell } from './layout/shell/shell';
import { Inicio } from './pages/inicio/inicio';
import { NovaSimulacao } from './pages/nova-simulacao/nova-simulacao';
import { MinhasSimulacoes } from './pages/minhas-simulacoes/minhas-simulacoes';
import { StatusBadge } from './shared/status-badge/status-badge';

registerLocaleData(localePt);

@NgModule({
  declarations: [
    App,
    Shell,
    Inicio,
    NovaSimulacao,
    MinhasSimulacoes,
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
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [environment.apiUrl]
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