import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-fitness',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './fitness.component.html',
  styleUrl: './fitness.component.css',
})
export class FitnessComponent {
  /* Données d'exemple — seront remplacées par Grafana */
  kpis = [
    { label: 'Séances / semaine', value: '3,5', trend: '+0,5', up: true, icon: 'event' },
    { label: 'Durée moy. séance', value: '45 min', trend: '+3 min', up: true, icon: 'timer' },
    { label: 'Calories brûlées', value: '420', trend: '+8%', up: true, icon: 'local_fire_department' },
    { label: 'Utilisateurs actifs', value: '328', trend: '+12%', up: true, icon: 'directions_run' },
  ];

  topExercises = [
    { label: 'Cardio', percent: 85, color: 'var(--admin-primary-300)' },
    { label: 'Musculation', percent: 70, color: 'var(--admin-primary-200)' },
    { label: 'HIIT', percent: 55, color: 'var(--admin-primary-200)' },
    { label: 'Yoga', percent: 35, color: 'var(--admin-primary-100)' },
    { label: 'Natation', percent: 20, color: 'var(--admin-primary-100)' },
  ];

  intensityLevels = [
    { label: 'Faible', percent: 20, color: 'var(--admin-primary-100)' },
    { label: 'Modéré', percent: 45, color: 'var(--admin-primary-200)' },
    { label: 'Intense', percent: 35, color: 'var(--admin-primary-300)' },
  ];

  weeklyProgress = [
    { label: 'Sem. 1', percent: 30, color: 'var(--admin-primary-100)' },
    { label: 'Sem. 2', percent: 42, color: 'var(--admin-primary-200)' },
    { label: 'Sem. 3', percent: 55, color: 'var(--admin-primary-200)' },
    { label: 'Sem. 4', percent: 68, color: 'var(--admin-primary-300)' },
  ];
}
