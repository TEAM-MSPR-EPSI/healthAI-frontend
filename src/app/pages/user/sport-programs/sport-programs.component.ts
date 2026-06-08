import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-sport-programs',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatProgressBarModule, MatButtonModule, RouterLink],
  templateUrl: './sport-programs.component.html',
  styleUrl: './sport-programs.component.css',
})
export class SportProgramsComponent implements OnInit {
  programs: any[] = [];
  loading = true;

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit() {
    const userId = this.auth.currentUser()?.user_id;

    const programs$ = this.api.getPrograms();
    const progresses$ = userId
      ? this.api.getSessionProgressesByUserId(String(userId))
      : of([]);

    forkJoin([programs$, progresses$]).subscribe({
      next: ([data, progresses]: [any[], any[]]) => {
        // Set des session_ids déjà faits par l'user (non utilisé, matching par rank maintenant)

        this.programs = data.map((p: any) => {
          const programSessions: any[] = Array.isArray(p.programSessions)
            ? p.programSessions : [];
          const total = programSessions.length;
          const programId = p.sport_program_id;
          const done = programSessions.filter((ps: any) => {
            const sid = Number(ps.sport_session_id ?? ps.sport_session?.sport_session_id);
            const rank = Number(ps.program_sport_session_rank);
            return progresses.some((pr: any) =>
              Number(pr.sport_program_id) === programId &&
              Number(pr.sport_session_id) === sid &&
              Number(pr.program_session_rank) === rank
            );
          }).length;
          const progress = total > 0 ? Math.round((done / total) * 100) : 0;

          return {
            id: p.sport_program_id,
            name: p.sport_program_name ?? p.program_name,
            description: p.sport_program_objective ?? p.program_goal,
            duration: `${p.sport_program_duration ?? p.program_duration_days ?? '?'} jours`,
            sessions: total,
            level: p.sport_program_objective ?? p.program_goal,
            progress,
            icon: 'fitness_center',
          };
        });
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
