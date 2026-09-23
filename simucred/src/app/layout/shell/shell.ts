import { Component, computed, inject, signal } from '@angular/core';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.html',
  standalone: false,
  styleUrl: './shell.css'
})
export class Shell {
  private readonly keycloak = inject(Keycloak);

  protected readonly menuAberto = signal(false);

  protected readonly nomeUsuario = computed(() => {
    const token = this.keycloak?.tokenParsed as Record<string, string> | undefined;
    return token?.['name'] || token?.['preferred_username'] || 'Usuário';
  });

  protected readonly iniciais = computed(() =>
    this.nomeUsuario()
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0].toUpperCase())
      .join('')
  );

  alternarMenu() {
    this.menuAberto.update((aberto) => !aberto);
  }

  logout() {
    if (typeof window !== 'undefined') {
      this.keycloak.logout({ redirectUri: window.location.origin });
    }
  }
}
