import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-program-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatProgressBarModule],
  templateUrl: './program-detail.component.html',
  styleUrl: './program-detail.component.css',
})
export class ProgramDetailComponent implements OnInit {
  program: any = null;
  loading = true;
  doneSessionIds = new Set<number>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isFinite(id) && id > 0) {
      this.api.getProgram(id).subscribe({
        next: (data) => {
          this.program = data;
          this.loading = false;
          this.loadProgresses();
        },
        error: () => { this.loading = false; },
      });
    } else {
      this.loading = false;
    }
  }

  private loadProgresses(): void {
    const userId = this.auth.currentUser()?.user_id;
    if (!userId) return;
    this.api.getSessionProgressesByUserId(String(userId)).subscribe({
      next: (progresses) => {
        this.doneSessionIds = new Set(
          progresses.map((p: any) => Number(p.sport_session_id))
        );
      },
      error: () => {},
    });
  }

  isSessionDone(sessionId: number): boolean {
    return this.doneSessionIds.has(sessionId);
  }

  startSession(id: number) {
    this.router.navigate(['/user/sport-sessions', id, 'start']);
  }
}