import { Component, OnInit } from '@angular/core';
import { GameService } from '../../services/game.service';
import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import {GroupByPipe} from '../../pipes/groupby.pipe';

@Component({
  selector: 'app-results',
  imports: [CommonModule, GroupByPipe],
  providers: [DatePipe,GroupByPipe],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {
  gameSessions: any[] = [];
  isLoading = true;

  constructor(private gameService: GameService) {}

  ngOnInit(): void {
    this.loadGameSessions();
  }

  loadGameSessions() {
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

  getTotalScore(results: any[]): number {
    return results.reduce((sum, result) => sum + result.score, 0);
  }

  getTotalClicks(results: any[]): number {
    return results.reduce((sum, result) => sum + result.clicks, 0);
  }

  getAverageTime(results: any[]): number {
    const totalTime = results.reduce((sum, result) => sum + result.averageTime, 0);
    return results.length > 0 ? totalTime / results.length : 0;
  }
}
