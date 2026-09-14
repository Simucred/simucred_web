import { Component, signal, inject } from '@angular/core';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('simucred_web');

  private keycloak = inject(Keycloak);

  logout() {
    if (typeof window !== 'undefined') {
      this.keycloak.logout({ redirectUri: window.location.origin });
    }
  }
}