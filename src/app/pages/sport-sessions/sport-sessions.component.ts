// Component: SportSessions | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-sport-sessions',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule, RouterLink],
  templateUrl: './sport-sessions.component.html',
  styleUrl: './sport-sessions.component.css',
})
export class SportSessionsComponent implements OnInit {
  sessions: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getSessions().subscribe({
      next: (data) => {
        this.sessions = data.map((s: any) => ({
          id: s.sport_session_id ?? s.session_id,
          name: s.sport_session_name ?? `Séance #${s.session_order}`,
          program: s.sport_program_name ?? s.program_name ?? '',
          date: '',
          duration: '',
          exercises: 0,
          calories: 0,
          status: 'planned',
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}

