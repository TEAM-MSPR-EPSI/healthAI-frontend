// Component: Fitness | Purpose: Renders and manages UI behavior for this view.
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

  topExercisesChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  topExercisesChartType: ChartType = 'bar';
  intensityChartData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  intensityChartType: ChartType = 'pie';
  progressChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  progressChartType: ChartType = 'line';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin({
      exercises: this.api.getExercises(),
      sessions: this.api.getSessions(),
      users: this.api.getUsers(),
    }).subscribe({
      next: ({ exercises, sessions, users }) => {
        const avgDuration = this.avg(exercises, 'sport_exercise_duration');
        const avgBurn = this.avg(exercises, 'sport_exercise_cal_burned');

        this.kpis = [
          { label: 'Séances', value: `${sessions.length}`, trend: 'Total en base', up: true, icon: 'event' },
          { label: 'Durée moy. exercice', value: `${Math.round(avgDuration)} min`, trend: 'Calcul API', up: true, icon: 'timer' },
          { label: 'Calories moy. brûlées', value: `${Math.round(avgBurn)}`, trend: 'Par exercice', up: true, icon: 'local_fire_department' },
          { label: 'Utilisateurs actifs', value: `${users.length}`, trend: 'Comptes total', up: true, icon: 'directions_run' },
        ];

        const byMuscle: Record<string, number> = {};
        exercises.forEach((exercise) => {
          const group = exercise.sport_exercise_muscle_group || 'Non défini';
          byMuscle[group] = (byMuscle[group] || 0) + 1;
        });
        const topGroups = Object.entries(byMuscle)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 6);

        this.topExercisesChartData = {
          labels: topGroups.map(([label]) => label),
          datasets: [{
            label: 'Nb exercices',
            data: topGroups.map(([, value]) => value),
            backgroundColor: 'rgba(67, 56, 202, 0.72)',
            borderRadius: 8,
          }],
        };

        const byDifficulty: Record<string, number> = {};
        exercises.forEach((exercise) => {
          const level = exercise.sport_exercise_difficulty || 'Non défini';
          byDifficulty[level] = (byDifficulty[level] || 0) + 1;
        });
        this.intensityChartData = {
          labels: Object.keys(byDifficulty),
          datasets: [{
            data: Object.values(byDifficulty),
            backgroundColor: [
              'rgba(16, 185, 129, 0.75)',
              'rgba(59, 130, 246, 0.75)',
              'rgba(239, 68, 68, 0.75)',
              'rgba(251, 191, 36, 0.75)',
            ],
            borderWidth: 0,
          }],
        };

        const labels = ['Sem. 1', 'Sem. 2', 'Sem. 3', 'Sem. 4'];
        const progressionValues = labels.map((_, idx) => {
          const limit = Math.ceil(((idx + 1) / labels.length) * sessions.length);
          return limit;
        });
        this.progressChartData = {
          labels,
          datasets: [{
            label: 'Sessions cumulées',
            data: progressionValues,
            borderColor: 'rgba(14, 116, 144, 1)',
            backgroundColor: 'rgba(14, 116, 144, 0.2)',
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

  private avg(items: any[], key: string): number {
    if (!items.length) return 0;
    const sum = items.reduce((acc, item) => acc + this.num(item[key]), 0);
    return sum / items.length;
  }
}
