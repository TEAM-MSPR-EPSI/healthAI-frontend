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
  doneEntries: Array<{ sessionId: number; rank: number }> = [];

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

  isSessionDone(sessionId: number, rank: number): boolean {
    return this.doneEntries.some(e => e.sessionId === sessionId && e.rank === rank);
  }

  private loadProgresses(): void {
    const userId = this.auth.currentUser()?.user_id;
    if (!userId) return;
    this.api.getSessionProgressesByUserId(String(userId)).subscribe({
      next: (progresses) => {
        const programId = this.program?.sport_program_id;
        this.doneEntries = progresses
          .filter((p: any) => Number(p.sport_program_id) === programId)
          .map((p: any) => ({ sessionId: Number(p.sport_session_id), rank: Number(p.program_session_rank) }));
      },
      error: () => {},
    });
  }

  startSession(sessionId: number, rank: number) {
    this.router.navigate(['/user/sport-sessions', sessionId, 'start'], {
      queryParams: { programId: this.program.sport_program_id, rank }
    });
  }
}