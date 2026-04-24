// Component: AdminDashboard | Purpose: Renders and manages UI behavior for this view.
import { CommonModule, NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { catchError, forkJoin, of } from 'rxjs';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ApiService } from '../../../services/api.service';

interface AdminDashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
}

interface OverviewStat {
  label: string;
  value: string;
  hint: string;
  icon: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, NgFor, RouterLink, MatCardModule, MatIconModule, NgChartsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent implements OnInit {
  isLoading = true;
  overviewStats: OverviewStat[] = [];
  contentChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  contentChartType: ChartType = 'bar';
  subscriptionChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  subscriptionChartType: ChartType = 'doughnut';
  retentionChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  retentionChartType: ChartType = 'line';

  protected readonly importantSections: AdminDashboardCard[] = [
    {
      title: 'Dashboard Admin',
      description: 'Vue d\'ensemble de l\'administration et accès rapide aux sections clés.',
      icon: 'dashboard',
      route: '/admin',
    },
    {
      title: 'Liste des Utilisateurs',
      description: 'Consultez et suivez les comptes utilisateurs de la plateforme.',
      icon: 'manage_accounts',
      route: '/admin/user-list',
    },
    {
      title: 'Métriques Utilisateurs',
      description: 'Analysez les données de progression et d\'engagement utilisateur.',
      icon: 'people',
      route: '/admin/user-metrics',
    },
    {
      title: 'Analyses Nutritionnelles',
      description: 'Suivez les tendances nutritionnelles et la qualité des données alimentaires.',
      icon: 'restaurant',
      route: '/admin/nutrition',
    },
    {
      title: 'Statistiques Fitness',
      description: 'Visualisez les performances sportives et les indicateurs d\'activité.',
      icon: 'fitness_center',
      route: '/admin/fitness',
    },
    {
      title: 'KPIs Business',
      description: 'Pilotez les indicateurs stratégiques et la performance globale.',
      icon: 'bar_chart',
      route: '/admin/kpi',
    },
    {
      title: 'Validation des données',
      description: 'Contrôlez la cohérence des données avant publication.',
      icon: 'checklist',
      route: '/admin/data-check',
    },
    {
      title: 'Gestion des données',
      description: 'Administrez les référentiels et les contenus métier.',
      icon: 'edit_note',
      route: '/admin/manage',
    },
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.isLoading = true;

    forkJoin({
      users: this.api.getUsers(),
      recipes: this.api.getRecipes(),
      ingredients: this.api.getFood(),
      exercises: this.api.getExercises(),
      equipment: this.api.getEquipment(),
      programs: this.api.getPrograms(),
      sessions: this.api.getSessions(),
      subscriptions: this.api.getSubscriptionBreakdown().pipe(
        catchError(() => of({ freemium: 0, premium: 0, company_admin: 0 })),
      ),
      retention: this.api.getMonthlyRetention().pipe(
        catchError(() => of({ labels: ['Sept.', 'Oct.', 'Nov.', 'Déc.'], data: [0, 0, 0, 0] })),
      ),
    }).subscribe({
      next: ({ users, recipes, ingredients, exercises, equipment, programs, sessions, subscriptions, retention }) => {
        this.overviewStats = [
          { label: 'Utilisateurs', value: `${users.length}`, hint: 'Comptes actifs dans la base', icon: 'people' },
          { label: 'Recettes', value: `${recipes.length}`, hint: 'Contenus nutritionnels publiés', icon: 'restaurant' },
          { label: 'Ingrédients', value: `${ingredients.length}`, hint: 'Référentiel alimentaire', icon: 'local_dining' },
          { label: 'Exercices', value: `${exercises.length}`, hint: 'Catalogue sport et musculation', icon: 'fitness_center' },
          { label: 'Matériel', value: `${equipment.length}`, hint: 'Équipements disponibles', icon: 'construction' },
          { label: 'Programmes / Séances', value: `${programs.length} / ${sessions.length}`, hint: 'Structure du catalogue sport', icon: 'event' },
        ];

        this.contentChartData = {
          labels: ['Utilisateurs', 'Recettes', 'Ingrédients', 'Exercices', 'Matériel', 'Programmes', 'Séances'],
          datasets: [
            {
              label: 'Volume',
              data: [users.length, recipes.length, ingredients.length, exercises.length, equipment.length, programs.length, sessions.length],
              backgroundColor: [
                '#4f6335',
                '#7a8f5a',
                '#9fb46d',
                '#bf8f3f',
                '#8b6b4c',
                '#3f5f6d',
                '#566573',
              ],
            },
          ],
        };

        const freemium = subscriptions.freemium || 0;
        const premium = subscriptions.premium || 0;
        const b2b = subscriptions.company_admin || 0;
        this.subscriptionChartData = {
          labels: ['Freemium', 'Premium', 'B2B'],
          datasets: [
            {
              label: 'Abonnés',
              data: [freemium, premium, b2b],
              backgroundColor: ['#9fb46d', '#4f6335', '#8b6b4c'],
            },
          ],
        };

        this.retentionChartData = {
          labels: retention.labels || ['Sept.', 'Oct.', 'Nov.', 'Déc.'],
          datasets: [
            {
              label: 'Rétention (%)',
              data: retention.data || [0, 0, 0, 0],
              borderColor: '#4f6335',
              backgroundColor: 'rgba(79, 99, 53, 0.18)',
              fill: true,
              tension: 0.35,
            },
          ],
        };

        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }
}
