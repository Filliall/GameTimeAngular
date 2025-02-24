// game.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { GameResult } from '../models/game-result';



@Injectable({
  providedIn: 'root'
})
export class GameService {
  private apiUrl = environment.apiUrl + '/api/gamesession';
  private currentSessionId: number | null = null;

  constructor(private http: HttpClient) {}

  // Start a new game session
  startGame(totalTurns: number): Observable<{ id: number }> {
    return this.http.post<{ id: number }>(`${this.apiUrl}/start-game`, { totalTurns });
  }

  // Save the result of a turn
  saveTurnResult(result: any): Observable<GameResult> {
    return this.http.post<GameResult>(`${this.apiUrl}/save-turn`, result);
  }

  // Get all game sessions
  getAllGameSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/active-sessions`);
  }

  // Get results for a specific session
  getSessionResults(sessionId: number): Observable<GameResult[]> {
    return this.http.get<GameResult[]>(`${this.apiUrl}/session-results/${sessionId}`);
  }

  // Set the current game session ID
  setCurrentSession(sessionId: number) {
    this.currentSessionId = sessionId;
  }

  // Get the current game session ID
  getCurrentSession(): number | null {
    return this.currentSessionId;
  }
}
