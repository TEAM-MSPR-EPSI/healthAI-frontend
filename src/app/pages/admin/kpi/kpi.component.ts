// Component: Kpi | Purpose: Renders and manages UI behavior for this view.

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
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
    // Charger les utilisateurs et abonnements pour les KPIs
    this.api.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.kpis = [
          { label: 'Utilisateurs', value: users.length, trend: '', up: true, icon: 'people' },
        ];
        // Charger les abonnements pour compléter les KPIs business
        this.api.getPrograms().subscribe({
          next: (programs) => {
            this.kpis.push({ label: 'Programmes sport', value: programs.length, trend: '', up: true, icon: 'fitness_center' });
            // Simuler la répartition abonnés (à remplacer par l'API réelle si dispo)
            const premium = users.filter(u => u.user_role === 'premium').length;
            const freemium = users.filter(u => u.user_role === 'user').length;
            const b2b = users.filter(u => u.user_role === 'company_admin').length;
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
            // Simuler la rétention mensuelle (à remplacer par l'API réelle si dispo)
            this.retentionChartData = {
              labels: ['Sept.', 'Oct.', 'Nov.', 'Déc.'],
              datasets: [
                {
                  label: 'Rétention (%)',
                  data: [75, 78, 80, 82],
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
      },
      error: () => { this.isLoading = false; },
    });
  }
}
