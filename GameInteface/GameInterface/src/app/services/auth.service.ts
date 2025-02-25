import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GameSessionService } from './game-session.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/api/auth/';
  private isAuthenticated = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticated.asObservable();

  constructor(private http: HttpClient, private router: Router, private gameSessionService: GameSessionService) {}

  register(username: string, password: string) {
    return this.http.post(this.apiUrl +'register', { username, password }).subscribe({
      next: () => {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert('Registration failed: ' + err.error);
      }
    });
  }

  login(username: string, password: string) {
    return this.http.post(this.apiUrl +'login', { username, password }).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('currentUser', username);
        this.isAuthenticated.next(true);

        // Add the player to a game session
        this.gameSessionService.addPlayerToSession(username).subscribe({
          next: (session: any) => {
            if (session.players.length >= 2) {
              // Start the game if there are enough players
              localStorage.setItem('session', session.id);
              this.gameSessionService.startGame(session.id).subscribe({
                next: () => {
                  this.router.navigate(['/game'], { queryParams: { sessionId: session.id } });
                },
                error: (err) => {
                  alert('Failed to start game: ' + err.error);
                }
              });
            } else {
              // Wait for more players
              this.router.navigate(['/waiting'], { queryParams: { sessionId: session.id } });
            }
          },
          error: (err) => {
            alert('Failed to join session: ' + err.error);
          }
        });
      },
      error: (err) => {
        alert('Login failed: ' + err.error);
      }
    });
  }

  logout() {
    localStorage.removeItem('token');
    this.isAuthenticated.next(false);
    this.router.navigate(['/login']);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  checkAuth() {
    const token = this.getToken();
    this.isAuthenticated.next(!!token);
  }
}
