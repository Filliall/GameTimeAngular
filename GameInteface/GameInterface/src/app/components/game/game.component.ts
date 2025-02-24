import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { GameSessionService } from '../../services/game-session.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  sessionId: number | null = null;
  players: string[] = [];
  currentPlayerIndex = 0;
  cumulativeTimes: { [playerName: string]: number } = {};
  eliminatedPlayers: string[] = [];
  gameOver = false;
  gameStarted = false;
  buttonVisible = false;
  buttonPosition = { top: '0px', left: '0px' };
  startTime!: number;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private gameSessionService: GameSessionService
  ) {}

  ngOnInit(): void {
    this.sessionId = +this.route.snapshot.queryParams['sessionId'];
    if (this.sessionId) {
      this.gameSessionService.getSession(this.sessionId).subscribe({
        next: (session: any) => {
          this.players = session.players;
          this.initializeCumulativeTimes();
          this.startGame();
        },
        error: (err) => {
          alert('Failed to load session: ' + err.error);
        }
      });
    }
  }

  initializeCumulativeTimes() {
    this.players.forEach(player => {
      this.cumulativeTimes[player] = 0;
    });
  }

  startGame() {
    this.gameStarted = true;
    this.gameOver = false;
    this.showButton();
  }

  handleButtonClick() {
    if (this.gameOver) return;

    const reactionTime = Date.now() - this.startTime;
    const currentPlayer = this.players[this.currentPlayerIndex];

    this.cumulativeTimes[currentPlayer] += reactionTime;

    if (this.cumulativeTimes[currentPlayer] > 30000) {
      this.eliminatePlayer(currentPlayer);
    }

    this.saveResult(currentPlayer, reactionTime);
    this.passTurn();
  }

  eliminatePlayer(playerName: string) {
    if (!this.eliminatedPlayers.includes(playerName)) {
      this.eliminatedPlayers.push(playerName);
      alert(`${playerName} has been eliminated for exceeding 30 seconds!`);
    }

    if (this.eliminatedPlayers.length === this.players.length) {
      this.endGame();
      return;
    }
  }

  passTurn() {
    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    } while (this.eliminatedPlayers.includes(this.players[this.currentPlayerIndex]));

    this.showButton();
  }

  showButton() {
    if (this.gameOver) return;

    const maxTop = 450;
    const maxLeft = 450;
    const newTop = Math.floor(Math.random() * maxTop);
    const newLeft = Math.floor(Math.random() * maxLeft);

    this.buttonPosition = {
      top: `${newTop}px`,
      left: `${newLeft}px`
    };

    this.startTime = Date.now();
    this.buttonVisible = true;
  }

  saveResult(playerName: string, reactionTime: number) {
    if (!this.sessionId) return;

    const result = {
      playerName,
      score: reactionTime,
      clicks: 1,
      averageTime: reactionTime,
      turn: this.currentPlayerIndex + 1,
      gameSessionId: this.sessionId
    };

    this.gameSessionService.addResult(result).subscribe({
      next: () => console.log('Turn result saved successfully'),
      error: (err) => console.error('Error saving turn result:', err)
    });
  }

  endGame() {
    this.gameOver = true;
    this.buttonVisible = false;
    alert('Game over! All players have been eliminated.');
    this.router.navigate(['/results']);
  }
}
