
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
      food: this.api.getFood(),
      programs: this.api.getPrograms(),
      sessions: this.api.getSessions(),
      exercises: this.api.getExercises(),
      equipment: this.api.getEquipment(),
      recipes: this.api.getRecipes(),
      retention: this.api.getMonthlyRetention().pipe(
        catchError(() => of({ labels: ['Sept.', 'Oct.', 'Nov.', 'Dec.'], data: [0, 0, 0, 0] }))
      ),
      subscriptionBreakdown: this.api.getSubscriptionBreakdown().pipe(
        catchError(() => of({ labels: ['Freemium', 'Premium', 'Premium+', 'B2B'], data: [0, 0, 0, 0] }))
      ),
    }).subscribe({
      next: ({ users, food, programs, sessions, exercises, equipment, recipes, retention, subscriptionBreakdown }) => {
        this.users = users;

        // Calculs utiles pour les KPI
        const totalUsers = users.length;
        const subscriptionValues = Array.isArray(subscriptionBreakdown?.data) ? subscriptionBreakdown.data : [0, 0, 0, 0];
        const totalSubscribed = subscriptionValues.reduce((sum: number, value: number) => sum + this.num(value), 0);
        const avgAge = this.getAverageAge(users);
        const sessionsPerUser = totalUsers > 0 ? (sessions.length / totalUsers).toFixed(1) : '0';
        const programsPerUser = totalUsers > 0 ? (programs.length / totalUsers).toFixed(1) : '0';
        const exercisesWithEquipment = exercises.filter((e: any) => e.exerciseEquipments && e.exerciseEquipments.length > 0).length;
        const equipmentCoverage = exercises.length > 0 ? Math.round((exercisesWithEquipment / exercises.length) * 100) : 0;

        this.kpis = [
          { label: 'Utilisateurs', value: totalUsers, trend: `${totalSubscribed} abonnés`, up: true, icon: 'people' },
          { label: 'Âge moyen', value: `${Math.round(avgAge)} ans`, trend: 'Utilisateurs actifs', up: true, icon: 'cake' },
          { label: 'Programmes sport', value: programs.length, trend: `${programsPerUser} / user`, up: true, icon: 'fitness_center' },
          { label: 'Séances', value: sessions.length, trend: `${sessionsPerUser} / user`, up: true, icon: 'event' },
          { label: 'Exercices', value: exercises.length, trend: `${equipmentCoverage}% avec équipement`, up: true, icon: 'sports_gymnastics' },
          { label: 'Recettes', value: recipes.length, trend: 'Catalogue nutrition', up: true, icon: 'restaurant_menu' },
          { label: 'Ingrédients', value: food.length, trend: 'Base nutritionnelle', up: true, icon: 'restaurant' },
          { label: 'Matériel', value: equipment.length, trend: 'Équipements disponibles', up: true, icon: 'construction' },
        ];

        // Données RÉELLES de répartition des abonnés
        this.revenueChartData = {
          labels: subscriptionBreakdown.labels || ['Freemium', 'Premium', 'Premium+', 'B2B'],
          datasets: [
            {
              label: 'Abonnés',
              data: subscriptionBreakdown.data || [0, 0, 0, 0],
              backgroundColor: [
                'rgba(159, 180, 109, 0.8)',
                'rgba(79, 99, 53, 0.85)',
                'rgba(191, 143, 63, 0.82)',
                'rgba(139, 107, 76, 0.82)'
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
              borderColor: '#4f6335',
              backgroundColor: 'rgba(79, 99, 53, 0.18)',
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

  private getAverageAge(users: any[]): number {
    const ages = users
      .map((user) => this.getAge(user.user_birth))
      .filter((age) => age > 0);

    if (!ages.length) {
      return 0;
    }

    return ages.reduce((sum, age) => sum + age, 0) / ages.length;
  }

  private getAge(birth: string): number {
    if (!birth) return 0;
    const birthDate = new Date(birth);
    const diff = Date.now() - birthDate.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  private num(value: unknown): number {
    const numberValue = Number(value);
    return Number.isFinite(numberValue) ? numberValue : 0;
  }
}
