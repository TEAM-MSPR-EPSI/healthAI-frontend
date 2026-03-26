// Component: UserMetrics | Purpose: Renders and manages UI behavior for this view.

import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { ApiService } from '../../../services/api.service';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-user-metrics',
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgChartsModule],
  templateUrl: './user-metrics.component.html',
  styleUrl: './user-metrics.component.css',
})
export class UserMetricsComponent implements OnInit {
  isLoading = true;
  users: any[] = [];
  kpis: any[] = [];
  // Chart.js configs
  ageChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  ageChartType: ChartType = 'bar';
  goalsChartData: ChartConfiguration<'pie'>['data'] = { labels: [], datasets: [] };
  goalsChartType: ChartType = 'pie';
  progressionChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  progressionChartType: ChartType = 'line';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.isLoading = true;
    this.api.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        // KPIs
        this.kpis = [
          { label: 'Utilisateurs actifs', value: users.length, trend: '', up: true, icon: 'people' },
        ];
        // Répartition par âge (exemple: 18-25, 26-35, 36-50)
        const ageGroups = { '18-25': 0, '26-35': 0, '36-50': 0, '50+': 0 };
        users.forEach(u => {
          const age = this.getAge(u.user_birth);
          if (age >= 18 && age <= 25) ageGroups['18-25']++;
          else if (age >= 26 && age <= 35) ageGroups['26-35']++;
          else if (age >= 36 && age <= 50) ageGroups['36-50']++;
          else if (age > 50) ageGroups['50+']++;
        });
        this.ageChartData = {
          labels: Object.keys(ageGroups),
          datasets: [
            {
              label: 'Utilisateurs',
              data: Object.values(ageGroups),
              backgroundColor: [
                'rgba(33, 150, 243, 0.7)',
                'rgba(120, 144, 156, 0.7)',
                'rgba(255, 193, 7, 0.7)',
                'rgba(76, 175, 80, 0.7)'
              ],
            },
          ],
        };
        // Objectifs (exemple: user_goal)
        const goalGroups: Record<string, number> = {};
        users.forEach(u => {
          const goal = u.user_goal || 'Autre';
          goalGroups[goal] = (goalGroups[goal] || 0) + 1;
        });
        this.goalsChartData = {
          labels: Object.keys(goalGroups),
          datasets: [
            {
              label: 'Objectifs',
              data: Object.values(goalGroups),
              backgroundColor: [
                'rgba(33, 150, 243, 0.7)',
                'rgba(255, 193, 7, 0.7)',
                'rgba(76, 175, 80, 0.7)',
                'rgba(244, 67, 54, 0.7)'
              ],
            },
          ],
        };
        // Progression mensuelle (exemple: user_weight par semaine, ici simulé)
        this.progressionChartData = {
          labels: ['Semaine 1', 'Semaine 2', 'Semaine 3', 'Semaine 4'],
          datasets: [
            {
              label: 'Progression moyenne',
              data: [25, 40, 55, 70],
              borderColor: 'rgba(33, 150, 243, 1)',
              backgroundColor: 'rgba(33, 150, 243, 0.2)',
              fill: true,
              tension: 0.3,
            },
          ],
        };
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  getAge(birth: string): number {
    if (!birth) return 0;
    const birthDate = new Date(birth);
    const diff = Date.now() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }
}
