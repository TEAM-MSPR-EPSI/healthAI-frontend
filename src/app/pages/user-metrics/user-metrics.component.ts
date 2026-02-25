import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-user-metrics',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './user-metrics.component.html',
  styleUrl: './user-metrics.component.css',
})
export class UserMetricsComponent {
  /* Données d'exemple — seront remplacées par Grafana */
  ageDistribution = [
    { label: '18-25 ans', value: 120, percent: 30, color: 'var(--admin-primary-100)' },
    { label: '26-35 ans', value: 200, percent: 50, color: 'var(--admin-primary-200)' },
    { label: '36-50 ans', value: 80, percent: 20, color: 'var(--admin-primary-300)' },
  ];

  goals = [
    { label: 'Perte de poids', value: 240, percent: 60, color: 'var(--admin-primary-300)' },
    { label: 'Prise de masse', value: 100, percent: 25, color: 'var(--admin-primary-200)' },
    { label: 'Remise en forme', value: 60, percent: 15, color: 'var(--admin-primary-100)' },
  ];

  kpis = [
    { label: 'Utilisateurs actifs', value: '400', trend: '+12%', up: true, icon: 'people' },
    { label: 'Nouveaux ce mois', value: '47', trend: '+8%', up: true, icon: 'person_add' },
    { label: 'Objectifs atteints', value: '70%', trend: '+5%', up: true, icon: 'emoji_events' },
    { label: 'Taux inactivité', value: '18%', trend: '-3%', up: false, icon: 'hourglass_empty' },
  ];

  progression = [
    { label: 'Semaine 1', percent: 25, color: 'var(--admin-primary-100)' },
    { label: 'Semaine 2', percent: 40, color: 'var(--admin-primary-200)' },
    { label: 'Semaine 3', percent: 55, color: 'var(--admin-primary-200)' },
    { label: 'Semaine 4', percent: 70, color: 'var(--admin-primary-300)' },
  ];
}
