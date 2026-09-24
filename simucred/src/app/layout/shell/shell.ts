import { Component, inject, signal } from '@angular/core';
import { UsuarioService } from '../../core/services/usuario';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.html',
  standalone: false,
  styleUrl: './shell.css'
})
export class Shell {
  private readonly usuario = inject(UsuarioService);

  protected readonly menuAberto = signal(false);
  protected readonly nomeUsuario = this.usuario.nome;
  protected readonly iniciais = this.usuario.iniciais;

  alternarMenu() {
    this.menuAberto.update((aberto) => !aberto);
  }

  logout() {
    this.usuario.logout();
  }
}
