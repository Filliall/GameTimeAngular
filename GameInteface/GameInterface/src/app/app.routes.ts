import { Routes } from '@angular/router';

import { ResultsComponent } from './components/results/results.component';
import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterPlayersComponent } from './components/register-players/register-players.component';


export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'register-players', component: RegisterPlayersComponent },
  { path: 'game', component: GameComponent },
  { path: 'results', component: ResultsComponent },
  { path: '**', redirectTo: '' }
];
