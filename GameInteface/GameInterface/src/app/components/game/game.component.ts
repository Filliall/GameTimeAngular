
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GameService } from './game.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-game',
  imports : [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  players: string[] = []; // List of players
  currentPlayerIndex = 0; // Index of the current player
  cumulativeTimes: { [playerName: string]: number } = {}; // Track cumulative times for each player
  eliminatedPlayers: string[] = []; // Track eliminated players
  gameOver = false; // Game over state
  gameStarted = false; // Game started state
  buttonVisible = false; // Button visibility
  buttonPosition = { top: '0px', left: '0px' }; // Button position
  startTime!: number; // Start time of the current turn
  sessionId: number | null = null; // Current game session ID

  constructor(private route: ActivatedRoute, private gameService : GameService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const playerNames = params['players'];
      if (playerNames) {
        this.players = playerNames.split(',');
        this.initializeCumulativeTimes();
        this.startGame();
      }
    });
  }

  // Initialize cumulative times for all players
  initializeCumulativeTimes() {
    this.players.forEach(player => {
      this.cumulativeTimes[player] = 0; // Initialize cumulative time to 0
    });
  }

  // Start the game
  startGame() {
    const totalTurns = this.players.length * 10; // Example: 10 turns per player
    this.gameService.startGame(totalTurns).subscribe(session => {
      this.sessionId = session.id; // Store the session ID
      this.gameStarted = true;
      this.gameOver = false;
      this.showButton();
    });
  }

  // Handle button click
  handleButtonClick() {
    if (this.gameOver) return; // Stop if the game is over

    const reactionTime = Date.now() - this.startTime;
    const currentPlayer = this.players[this.currentPlayerIndex];

    // Update cumulative time for the current player
    this.cumulativeTimes[currentPlayer] += reactionTime;

    // Check if player is eliminated
    if (this.cumulativeTimes[currentPlayer] > 30000) { // 30,000ms = 30 seconds
      this.eliminatePlayer(currentPlayer);
    }

    // Save result and proceed
    this.saveResult(currentPlayer, reactionTime);
    this.passTurn();
  }

  // Eliminate a player
  eliminatePlayer(playerName: string) {
    if (!this.eliminatedPlayers.includes(playerName)) {
      this.eliminatedPlayers.push(playerName);
      alert(`${playerName} has been eliminated for exceeding 30 seconds!`);
    }

    // Check if all players are eliminated
    if (this.eliminatedPlayers.length === this.players.length) {
      this.endGame();
      return;
    }
  }

  // Pass the turn to the next player
  passTurn() {
    // Move to the next player who is not eliminated
    do {
      this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    } while (this.eliminatedPlayers.includes(this.players[this.currentPlayerIndex]));

    // Show the button for the next player
    this.showButton();
  }

  // Show the button at a random position
  showButton() {
    if (this.gameOver) return;

    // Random position within 500x500 container (adjust based on your container size)
    const maxTop = 450; // 500 - button height (50)
    const maxLeft = 450; // 500 - button width (50)
    const newTop = Math.floor(Math.random() * maxTop);
    const newLeft = Math.floor(Math.random() * maxLeft);

    this.buttonPosition = {
      top: `${newTop}px`,
      left: `${newLeft}px`
    };

    this.startTime = Date.now();
    this.buttonVisible = true;
  }

  // Save the result to the backend
  saveResult(playerName: string, reactionTime: number) {
    const result = {
      id: 1,
      playerName,
      score: reactionTime,
      clicks: 1,
      averageTime: reactionTime,
      turn: this.currentPlayerIndex + 1,
      gameDate: new Date().toISOString(),
      gameMode: 'singleplayer',
      gameSessionId: this.sessionId // Include the session ID
    };

    this.gameService.saveTurnResult(result).subscribe({
      next: () => console.log('Turn result saved successfully'),
      error: (err) => console.error('Error saving turn result:', err)
    });
  }

  // End the game
  endGame() {
    this.gameOver = true;
    this.buttonVisible = false;
    alert('Game over! All players have been eliminated.');
    // Additional cleanup or result saving logic
  }
}
