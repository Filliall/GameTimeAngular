import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GameSession } from '../models/game-session';

@Injectable({
  providedIn: 'root'
})

export class ResultsService {

  private apiUrl = environment.apiUrl + '/api/gamesession';
    private currentSessionId: number | null = null;

    constructor(private http: HttpClient) { }
  getAllGameSessions() {
    return this.http.get<GameSession[]>(`${this.apiUrl}/active-sessions`);
  }
}



