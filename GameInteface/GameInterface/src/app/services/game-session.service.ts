import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameSessionService {
  private apiUrl = environment.apiUrl + '/api/gamesession';

  constructor(private http: HttpClient) {}

  createSession(players: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, players);
  }


  addResult(result: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/add-result`, result);
  }

  // Add a player to a game session
  addPlayerToSession(playerName: string): Observable<any> {
    const body = { playerName }; // Wrap the playerName in an object
  return this.http.post(`${this.apiUrl}/add-player`, body, {
    headers: { 'Content-Type': 'application/json' } // Explicitly set the Content-Type
  });
  }

  // Start the game for a specific session
  startGame(sessionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/start-game/${sessionId}`, {});
  }

  // Get the details of a specific session
  getSession(sessionId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${sessionId}`);
  }

  // Get all active game sessions
  getActiveSessions(): Observable<any> {
    return this.http.get(`${this.apiUrl}/active-sessions`);
  }
}
