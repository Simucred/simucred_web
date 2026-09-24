import { TestBed } from '@angular/core/testing';
import { UsuarioService } from './usuario';
import { criarKeycloakFake, providersDeTeste } from '../../testing/test-providers';

describe('UsuarioService', () => {
  function criarServico(nome?: string) {
    const keycloak = criarKeycloakFake(nome);
    TestBed.configureTestingModule({ providers: providersDeTeste(keycloak) });
    return { service: TestBed.inject(UsuarioService), keycloak };
  }

  it('deve ler o nome, primeiro nome e iniciais do token', () => {
    const { service } = criarServico('Maria Silva Santos');
    expect(service.nome()).toBe('Maria Silva Santos');
    expect(service.primeiroNome()).toBe('Maria');
    expect(service.iniciais()).toBe('MS');
  });

  it('deve usar "Usuário" quando não houver token', () => {
    const { service } = criarServico();
    expect(service.nome()).toBe('Usuário');
    expect(service.iniciais()).toBe('U');
  });

  it('deve chamar o logout do Keycloak', () => {
    const { service, keycloak } = criarServico('Maria Silva Santos');
    service.logout();
    expect(keycloak.logout).toHaveBeenCalledWith({ redirectUri: window.location.origin });
  });
});
