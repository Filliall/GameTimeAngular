import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GameSessionService } from '../../services/game-session.service';
import { GameHubService } from '../../services/gamehub.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-game',
  imports: [CommonModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit, OnDestroy {
  sessionId!: string;
  currentSession!: any;
  currentUser: string;
  playerTimes: { [key: string]: number } = {};
  eliminatedPlayers: string[] = [];
  currentPlayerTurn: string | undefined;
  isMyTurn = false;
  myTime = 0;
  startTime: number | undefined;


  constructor(
    private route: ActivatedRoute,
    private gameService: GameSessionService,
    private gameHub: GameHubService,
    private authService: AuthService
  ) {
    this.currentUser = localStorage.getItem('currentUser') || '';
   }

  async ngOnInit() {
    var sessionId = this.route.snapshot.queryParams['sessionId'];

    this.startTime = Date.now();



    await this.gameHub.startConnection();
    await this.gameHub.joinSessionGroup(sessionId, this.currentUser);

    // Initial turn check
    this.gameService.getSession(sessionId).subscribe(session => {
      this.currentSession = session;
      this.currentPlayerTurn = session.players[session.currentPlayerIndex];
        this.isMyTurn = this.currentUser === this.currentPlayerTurn;
    });

    this.gameHub.onTurnUpdate(data => {
      this.currentPlayerTurn = data.currentPlayer;
      this.isMyTurn = this.currentUser === this.currentPlayerTurn;
      this.playerTimes = data.playerTimes;
      this.eliminatedPlayers = data.eliminatedPlayers;
      this.isMyTurn = this.currentPlayerTurn === this.currentUser &&
                     !this.eliminatedPlayers.includes(this.currentUser);
      this.myTime = this.playerTimes[this.currentUser] || 0;
    });


   this.gameHub.onPlayerEliminated(player => {
      console.log(`${player} has been eliminated!`);
    });



  }

  handleButtonClick() {
    if (!this.isMyTurn) return;

    // Calculate reaction time
    if (this.startTime === undefined) {
      console.error('Start time is undefined');
      return;
    }
    const reactionTime = Date.now() - this.startTime;


    // Disable button immediately
    this.isMyTurn = false;

    this.gameHub.onUpdateTurn(this.currentSession.id, this.currentUser);

  }


  getTimeClass(player: string) {
    return {
      'eliminated': this.eliminatedPlayers.includes(player),
      'current-turn': this.currentUser === player
    };
  }


  ngOnDestroy() {
    this.gameHub.stopConnection();
  }
}
