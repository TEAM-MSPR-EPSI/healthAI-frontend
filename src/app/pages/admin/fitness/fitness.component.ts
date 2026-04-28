import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-fitness',
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgChartsModule],
  templateUrl: './fitness.component.html',
  styleUrl: './fitness.component.css',
})
export class FitnessComponent implements OnInit {
  isLoading = true;
  kpis: Array<{ label: string; value: string; trend: string; up: boolean; icon: string }> = [];

  topSessionsChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  topSessionsChartType: ChartType = 'bar';
  topUsersChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  topUsersChartType: ChartType = 'bar';
  progressChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  progressChartType: ChartType = 'line';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin({
      sessionProgresses: this.api.getSessionProgresses(),
      users: this.api.getUsers(),
    }).subscribe({
      next: ({ sessionProgresses, users }) => {
        const uniqueActiveUsers = new Set(sessionProgresses.map((progress) => this.num(progress.user_id))).size;
        const sessionsPerActiveUser = uniqueActiveUsers > 0 ? (sessionProgresses.length / uniqueActiveUsers).toFixed(1) : '0';
        const weeklySessions = this.buildWeeklySessionsSeries(sessionProgresses);

        this.kpis = [
          { label: 'Sessions complétées', value: `${sessionProgresses.length}`, trend: 'Historique réel', up: true, icon: 'event' },
          { label: 'Utilisateurs actifs', value: `${uniqueActiveUsers}`, trend: 'Ayant suivi au moins une séance', up: true, icon: 'directions_run' },
          { label: 'Sessions / utilisateur', value: `${sessionsPerActiveUser}`, trend: 'Moyenne sur les actifs', up: true, icon: 'insights' },
          { label: 'Utilisateurs inscrits', value: `${users.length}`, trend: 'Base totale', up: true, icon: 'people' },
        ];

        const bySession: Record<string, number> = {};
        const byUser: Record<string, number> = {};

        sessionProgresses.forEach((progress) => {
          const sessionName = progress.sport_session?.sport_session_name || progress.sport_session_name || 'Séance inconnue';
          const userName = this.getUserLabel(progress.user);

          bySession[sessionName] = (bySession[sessionName] || 0) + 1;
          byUser[userName] = (byUser[userName] || 0) + 1;
        });
        const topSessions = Object.entries(bySession)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6);

        const topUsers = Object.entries(byUser)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6);

        this.topSessionsChartData = {
          labels: topSessions.map(([label]) => label),
          datasets: [{
            label: 'Séances complétées',
            data: topSessions.map(([, value]) => value),
            backgroundColor: '#4f6335',
            borderRadius: 8,
          }],
        };

        this.topUsersChartData = {
          labels: topUsers.map(([label]) => label),
          datasets: [{
            label: 'Séances suivies',
            data: topUsers.map(([, value]) => value),
            backgroundColor: '#8b6b4c',
            borderRadius: 8,
          }],
        };

        // Données RÉELLES de sessions cumulées par semaine depuis l'API
        this.progressChartData = {
          labels: weeklySessions.labels,
          datasets: [{
            label: 'Sessions cumulées',
            data: weeklySessions.data,
            borderColor: '#4f6335',
            backgroundColor: 'rgba(79, 99, 53, 0.18)',
            fill: true,
            tension: 0.35,
          }],
        };

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  private num(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private getUserLabel(user: any): string {
    if (!user) {
      return 'Utilisateur inconnu';
    }

    return [user.user_firstname, user.user_lastname]
      .filter(Boolean)
      .join(' ')
      || user.user_username
      || `Utilisateur ${user.user_id ?? ''}`.trim();
  }

  private buildWeeklySessionsSeries(sessionProgresses: any[]): { labels: string[]; data: number[] } {
    if (!sessionProgresses.length) {
      return {
        labels: ['Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4'],
        data: [0, 0, 0, 0],
      };
    }

    const dates = sessionProgresses
      .map((progress) => String(progress.session_progress_start || progress.session_progress_end || '').slice(0, 10))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    const latestDate = dates[dates.length - 1];
    const latest = new Date(`${latestDate}T00:00:00`);
    const weeks = [] as Array<{ start: string; end: string; label: string }>;

    for (let i = 3; i >= 0; i--) {
      const weekEnd = new Date(latest);
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      const weekStart = new Date(weekEnd);
      weekStart.setDate(weekStart.getDate() - 6);

      weeks.push({
        start: weekStart.toISOString().split('T')[0],
        end: weekEnd.toISOString().split('T')[0],
        label: `Sem. ${4 - i}`,
      });
    }

    let cumulativeCount = 0;
    const data: number[] = [];

    weeks.forEach((week) => {
      const sessionCount = sessionProgresses.filter((progress) => {
        const start = String(progress.session_progress_start || progress.session_progress_end || '').slice(0, 10);
        return start >= week.start && start <= week.end;
      }).length;

      cumulativeCount += sessionCount;
      data.push(cumulativeCount);
    });

    return {
      labels: weeks.map((week) => week.label),
      data,
    };
  }
}
