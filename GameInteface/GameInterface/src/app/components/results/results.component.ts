// results-page.component.ts
import { Component, OnInit } from '@angular/core';
import { ResultsService } from './results.service';
import { GameSession } from '../../models/game-session';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { PlayerResults } from '../../models/player-results';
import { GameService } from '../game/game.service';
import { GameResult } from '../../models/game-result';

@Component({
  selector: 'app-results',
  imports: [DatePipe, CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  gameSessions: GameSession[] = []; // List of all game sessions
  isLoading = true; // Loading state
  selectedSession: GameSession | null = null; // Currently selected session

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadGameSessions();
  }

  // Load all game sessions from the backend
  loadGameSessions() {
    this.isLoading = true;
    this.gameService.getAllGameSessions().subscribe({
      next: (sessions) => {
        this.gameSessions = sessions;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading game sessions:', err);
        this.isLoading = false;
      }
    });
  }

  // Load results for a specific session
  loadSessionResults(sessionId: number) {
    this.gameService.getSessionResults(sessionId).subscribe({
      next: (results) => {
        const session = this.gameSessions.find(s => s.id === sessionId);
        if (session) {
          session.results = results;
          this.selectedSession = session;
        }
      },
      error: (err) => {
        console.error('Error loading session results:', err);
      }
    });
  }

  // Get player-specific results for a session
  getPlayerResults(results: GameResult[]): { [playerName: string]: GameResult[] } {
    return results.reduce((acc, result) => {
      if (!acc[result.playerName]) {
        acc[result.playerName] = [];
      }
      acc[result.playerName].push(result);
      return acc;
    }, {} as { [playerName: string]: GameResult[] });
  }

  // Calculate total score for a player
  getTotalScore(results: GameResult[]): number {
    return results.reduce((sum, result) => sum + result.score, 0);
  }

  // Calculate total clicks for a player
  getTotalClicks(results: GameResult[]): number {
    return results.reduce((sum, result) => sum + result.clicks, 0);
  }

  // Calculate average time for a player
  getAverageTime(results: GameResult[]): number {
    const totalTime = results.reduce((sum, result) => sum + result.averageTime, 0);
    return results.length > 0 ? totalTime / results.length : 0;
  }
}
