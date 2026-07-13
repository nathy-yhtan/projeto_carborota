import { Routes } from '@angular/router';
import { precisaLogin } from './usuario.service';
import { HomeComponent } from './home/home.component';
import { CalcularComponent } from './calcular/calcular.component';
import { ContatoComponent } from './contato/contato.component';
import { LoginComponent } from './login/login.component';
import { LgpdComponent } from './lgpd/lgpd.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'calcular', component: CalcularComponent, canActivate: [precisaLogin] },
  { path: 'contato', component: ContatoComponent, canActivate: [precisaLogin] },
  { path: 'login', component: LoginComponent },
  { path: 'lgpd', component: LgpdComponent },
  { path: '**', redirectTo: '' },
];
