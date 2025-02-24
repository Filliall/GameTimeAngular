// home.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home-container">
      <h1>Welcome to the Button Game!</h1>
      <p>Test your reaction time and compete with others.</p>
      <button routerLink="/game" mat-raised-button color="primary">
        Start Playing
      </button>
    </div>
  `,
  styles: [`
    .home-container {
      text-align: center;
      padding: 50px;
    }
    h1 {
      color: #4CAF50;
      margin-bottom: 20px;
    }
    p {
      font-size: 1.2em;
      margin-bottom: 30px;
    }
  `]
})
export class HomeComponent {}
