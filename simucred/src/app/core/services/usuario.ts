import { Injectable, computed, inject } from '@angular/core';
import Keycloak from 'keycloak-js';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private readonly keycloak = inject(Keycloak);

  readonly nome = computed(() => {
    const token = this.keycloak?.tokenParsed as Record<string, string> | undefined;
    return token?.['name'] || token?.['preferred_username'] || 'Usuário';
  });

  readonly primeiroNome = computed(() => this.nome().split(' ')[0]);

  readonly iniciais = computed(() =>
    this.nome()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join('')
  );

  logout() {
    if (typeof window !== 'undefined') {
      this.keycloak.logout({ redirectUri: window.location.origin });
    }
  }
}
