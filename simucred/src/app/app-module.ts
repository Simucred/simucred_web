import { NgModule, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
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

@NgModule({
  declarations: [
    App,
    Shell,
    Inicio,
    NovaSimulacao,
    MinhasSimulacoes
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
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