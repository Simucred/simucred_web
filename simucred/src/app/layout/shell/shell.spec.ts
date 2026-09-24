import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { Shell } from './shell';
import { criarKeycloakFake, providersDeTeste } from '../../testing/test-providers';

describe('Shell', () => {
  const keycloak = criarKeycloakFake('Maria Silva Santos');

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterModule.forRoot([])],
      declarations: [Shell],
      providers: providersDeTeste(keycloak)
    });
  });

  it('deve mostrar o nome e as iniciais do usuário na topbar', () => {
    const fixture = TestBed.createComponent(Shell);
    fixture.detectChanges();
    const topbar = fixture.nativeElement.querySelector('.topbar') as HTMLElement;
    expect(topbar.textContent).toContain('Maria Silva Santos');
    expect(topbar.querySelector('.avatar')?.textContent).toContain('MS');
  });

  it('deve abrir o menu do usuário e fazer logout', () => {
    const fixture = TestBed.createComponent(Shell);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('.usuario-menu')).toBeNull();
    el.querySelector<HTMLButtonElement>('.usuario-botao')!.click();
    fixture.detectChanges();

    el.querySelector<HTMLButtonElement>('.usuario-menu button')!.click();
    expect(keycloak.logout).toHaveBeenCalled();
  });

  it('deve ter os links do menu lateral', () => {
    const fixture = TestBed.createComponent(Shell);
    fixture.detectChanges();
    const links = Array.from(fixture.nativeElement.querySelectorAll('nav a')) as HTMLAnchorElement[];
    expect(links.map((a) => a.getAttribute('href'))).toEqual(['/inicio', '/nova-simulacao', '/simulacoes']);
  });
});
