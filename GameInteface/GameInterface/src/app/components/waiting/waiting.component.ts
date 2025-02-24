import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GameSessionService } from '../../services/game-session.service';

@Component({
  selector: 'app-waiting',
  templateUrl: './waiting.component.html',
  styleUrls: ['./waiting.component.css']
})
export class WaitingComponent implements OnInit {
  sessionId: number | null = null;

  constructor(
    private route: ActivatedRoute,private router: Router,
    private gameSessionService: GameSessionService
  ) {}

  ngOnInit(): void {
    this.sessionId = +this.route.snapshot.queryParams['sessionId'];
    this.checkSessionStatus();
  }

  checkSessionStatus() {
    if (this.sessionId) {
      this.gameSessionService.getSession(this.sessionId).subscribe({
        next: (session: any) => {
          if (session.Players.length >= 2) {
            // Redirect to the game page
            this.router.navigate(['/game'], { queryParams: { sessionId: this.sessionId } });
          } else {
            // Continue waiting
            setTimeout(() => this.checkSessionStatus(), 5000); // Check every 5 seconds
          }
        },
        error: (err) => {
          alert('Failed to check session status: ' + err.error);
        }
      });
    }
  }
}
