import { Routes } from '@angular/router';

import { ResultsComponent } from './components/results/results.component';
import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterPlayersComponent } from './components/register-players/register-players.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { WaitingComponent } from './components/waiting/waiting.component';


export const routes: Routes = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: 'game', component: GameComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'waiting', component: WaitingComponent },
];
