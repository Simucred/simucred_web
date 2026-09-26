import { LOCALE_ID, DEFAULT_CURRENCY_CODE, provideZonelessChangeDetection } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import Keycloak from 'keycloak-js';

registerLocaleData(localePt);

export function criarKeycloakFake(nome?: string) {
  return {
    tokenParsed: nome ? { name: nome } : undefined,
    logout: jasmine.createSpy('logout')
  };
}

export function providersDeTeste(keycloak = criarKeycloakFake('Maria Silva Santos')) {
  return [
    provideZonelessChangeDetection(),
    provideHttpClient(),
    provideHttpClientTesting(),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    { provide: Keycloak, useValue: keycloak }
  ];
}
