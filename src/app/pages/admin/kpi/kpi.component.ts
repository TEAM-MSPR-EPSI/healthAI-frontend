// Component: Kpi | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kpi',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './kpi.component.html',
  styleUrl: './kpi.component.css',
})
export class KpiComponent implements OnInit {
  isLoading = true;
  /* Données d'exemple — seront remplacées par Grafana */
  kpis = [
    { label: 'Rétention mensuelle', value: '82%', trend: '+2%', up: true, icon: 'loyalty' },
    { label: 'Abonnés Premium', value: '320', trend: '+18', up: true, icon: 'star' },
    { label: 'MRR', value: '4 800 €', trend: '+6%', up: true, icon: 'attach_money' },
    { label: 'Taux conversion', value: '12%', trend: '0%', up: true, icon: 'trending_up' },
  ];

  retentionMonths = [
    { label: 'Sept.', percent: 75, color: 'var(--admin-primary-100)' },
    { label: 'Oct.', percent: 78, color: 'var(--admin-primary-200)' },
    { label: 'Nov.', percent: 80, color: 'var(--admin-primary-200)' },
    { label: 'Déc.', percent: 82, color: 'var(--admin-primary-300)' },
  ];

  revenueBreakdown = [
    { label: 'Freemium', percent: 0, value: '0 €', color: 'var(--admin-gray-300)' },
    { label: 'Premium', percent: 55, value: '2 640 €', color: 'var(--admin-primary-200)' },
    { label: 'Premium+', percent: 35, value: '1 680 €', color: 'var(--admin-primary-300)' },
    { label: 'B2B', percent: 10, value: '480 €', color: 'var(--admin-primary-400)' },
  ];

  engagementMetrics = [
    { label: 'Connexions / jour', percent: 65, color: 'var(--admin-primary-200)' },
    { label: 'Utilisation suivi nutri.', percent: 78, color: 'var(--admin-primary-300)' },
    { label: 'Utilisation fitness', percent: 60, color: 'var(--admin-primary-200)' },
    { label: 'Satisfaction (NPS)', percent: 72, color: 'var(--admin-primary-300)' },
  ];

  ngOnInit() {
    // Simule le chargement des données (500ms pour voir l'effet)
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}
