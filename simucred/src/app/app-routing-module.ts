import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Shell } from './layout/shell/shell';
import { Inicio } from './pages/inicio/inicio';
import { NovaSimulacao } from './pages/nova-simulacao/nova-simulacao';
import { MinhasSimulacoes } from './pages/minhas-simulacoes/minhas-simulacoes';

const routes: Routes = [
  {
    path: '',
    component: Shell,
    children: [
      { path: '', redirectTo: 'inicio', pathMatch: 'full' },
      { path: 'inicio', component: Inicio, title: 'Início | Simucred' },
      { path: 'nova-simulacao', component: NovaSimulacao, title: 'Nova Simulação | Simucred' },
      { path: 'simulacoes', component: MinhasSimulacoes, title: 'Minhas Simulações | Simucred' }
    ]
  },
  { path: '**', redirectTo: 'inicio' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
