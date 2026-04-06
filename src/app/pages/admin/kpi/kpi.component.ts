// Component: Kpi | Purpose: Renders and manages UI behavior for this view.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { catchError, forkJoin, of } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-kpi',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, NgChartsModule],
  templateUrl: './kpi.component.html',
  styleUrl: './kpi.component.css',
})
export class KpiComponent implements OnInit {
  isLoading = true;
  kpis: any[] = [];
  users: any[] = [];
  // Chart.js configs
  revenueChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  revenueChartType: ChartType = 'bar';
  retentionChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  retentionChartType: ChartType = 'line';

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.isLoading = true;
    // Charger les utilisateurs et les données analytics réelles
    forkJoin({
      users: this.api.getUsers(),
      programs: this.api.getPrograms(),
      retention: this.api.getMonthlyRetention().pipe(
        catchError(() => of({ labels: ['Sept.', 'Oct.', 'Nov.', 'Dec.'], data: [0, 0, 0, 0] }))
      ),
      subscriptionBreakdown: this.api.getSubscriptionBreakdown().pipe(
        catchError(() => of({ freemium: 0, premium: 0, company_admin: 0 }))
      ),
    }).subscribe({
      next: ({ users, programs, retention, subscriptionBreakdown }) => {
        this.users = users;
        this.kpis = [
          { label: 'Utilisateurs', value: users.length, trend: '', up: true, icon: 'people' },
          { label: 'Programmes sport', value: programs.length, trend: '', up: true, icon: 'fitness_center' },
        ];

        // Données RÉELLES de répartition des abonnés
        const freemium = subscriptionBreakdown.freemium || 0;
        const premium = subscriptionBreakdown.premium || 0;
        const b2b = subscriptionBreakdown.company_admin || 0;

        this.revenueChartData = {
          labels: ['Freemium', 'Premium', 'B2B'],
          datasets: [
            {
              label: 'Abonnés',
              data: [freemium, premium, b2b],
              backgroundColor: [
                'rgba(120, 144, 156, 0.7)',
                'rgba(33, 150, 243, 0.7)',
                'rgba(255, 193, 7, 0.7)'
              ],
            },
          ],
        };

        // Données RÉELLES de rétention mensuelle depuis l'API analytics
        this.retentionChartData = {
          labels: retention.labels || ['Sept.', 'Oct.', 'Nov.', 'Déc.'],
          datasets: [
            {
              label: 'Rétention (%)',
              data: retention.data || [0, 0, 0, 0],
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
}
