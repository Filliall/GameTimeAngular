// navigation.component.ts
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive], // Import RouterLink and RouterLinkActive
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent {
  navItems = [
    { path: '/', label: 'Home', icon: 'home' },
    { path: '/register-players', label: 'Register Players', icon: 'person_add' },
    { path: '/game', label: 'Play Game', icon: 'sports_esports' },
    { path: '/results', label: 'Results', icon: 'leaderboard' }
  ];
}
