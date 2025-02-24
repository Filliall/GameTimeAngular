// register-players.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-players',
  standalone: true,
  imports: [CommonModule, FormsModule], // Import FormsModule for two-way binding
  templateUrl: './register-players.component.html',
  styleUrls: ['./register-players.component.css']
})
export class RegisterPlayersComponent implements OnInit {
  players: string[] = []; // Default to 2 players
  minPlayers = 2;
  maxPlayers = 4;
  gameModes = [
    { value: 'alternating', label: 'Alternating Turns' },
    { value: 'simultaneous', label: 'Simultaneous Play' }
  ];
  selectedMode = this.gameModes[0].value; // Default to alternating turns

  constructor(private router: Router) {}


  ngOnInit() {
    this.players.push('');
    this.players.push('');
  }

  addPlayer() {
    if (this.players.length < this.maxPlayers) {
      this.players.push('');
    }
  }

  removePlayer(index: number) {
    if (this.players.length > this.minPlayers) {
      this.players.splice(index, 1);
    }
  }

  startGame() {
    const validPlayers = this.players.filter(player => player.trim() !== '');
    if (validPlayers.length >= this.minPlayers) {
      // Navigate to the game page with player names as query parameters
      this.router.navigate(['/game'], {
        queryParams: { players: validPlayers.join(',') ,
          mode: this.selectedMode}
      });
    } else {
      alert(`Please enter at least ${this.minPlayers} player names.`);
    }
  }

  trackByFn(index: any, item: any) {
    return index;
  }
}
