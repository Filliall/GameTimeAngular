import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameHubService {
  private hubConnection: HubConnection;
 private apiUrl = environment.apiUrl + '/api/gamesession';
  constructor() {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.apiUrl + '/gamehub')
      .build();
  }

  startConnection() {
    return this.hubConnection.start();
  }

  stopConnection() {
    return this.hubConnection.stop();
  }

  joinSessionGroup(sessionId: string, currentUser :  string) {
    return this.hubConnection.invoke('JoinSessionGroup', sessionId, currentUser);
  }

  onTurnUpdate(callback: (data :any) => void) {
    this.hubConnection.on('TurnAdvanced', callback);
  }


  onPlayerEliminated(callback: (player: string) => void) {
     this.hubConnection.on('PlayerEliminated', callback);
  }

  onUpdateTurn(sessionId : number, currentPlayer: string) {
    // Notify server to advance turn
    this.hubConnection.invoke('AdvanceTurn', sessionId, currentPlayer)
    .catch(err => console.error('Error advancing turn:', err));
 }
}
