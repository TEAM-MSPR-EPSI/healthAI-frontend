// Component: SportPrograms | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

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

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getPrograms().subscribe({
      next: (data) => {
        this.programs = data.map((p: any) => ({
          id: p.sport_program_id,
          name: p.sport_program_name ?? p.program_name,
          description: p.sport_program_objective ?? p.program_goal,
          duration: `${p.sport_program_duration ?? p.program_duration_days ?? '?'} jours`,
          sessions: p.sport_program_sessions ?? p.program_session_count ?? 0,
          level: p.sport_program_objective ?? p.program_goal,
          progress: 0,
          icon: 'fitness_center',
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
