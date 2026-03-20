// Component: Nutrition | Purpose: Renders and manages UI behavior for this view.
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.css',
})
export class NutritionComponent {
  /* Données d'exemple — seront remplacées par Grafana */
  kpis = [
    { label: 'Calories moy./jour', value: '2 100', trend: '-3%', up: false, icon: 'local_fire_department' },
    { label: 'Protéines moy.', value: '90 g', trend: '+4%', up: true, icon: 'egg' },
    { label: 'Glucides moy.', value: '250 g', trend: '+1%', up: true, icon: 'bakery_dining' },
    { label: 'Lipides moy.', value: '70 g', trend: '-2%', up: false, icon: 'water_drop' },
  ];

  macroBreakdown = [
    { label: 'Protéines', percent: 25, color: 'var(--admin-primary-300)' },
    { label: 'Glucides', percent: 50, color: 'var(--admin-primary-200)' },
    { label: 'Lipides', percent: 25, color: 'var(--admin-primary-100)' },
  ];

  dailyCalories = [
    { label: 'Lundi', value: 2050, percent: 68, color: 'var(--admin-primary-200)' },
    { label: 'Mardi', value: 2200, percent: 73, color: 'var(--admin-primary-200)' },
    { label: 'Mercredi', value: 1900, percent: 63, color: 'var(--admin-primary-100)' },
    { label: 'Jeudi', value: 2350, percent: 78, color: 'var(--admin-primary-300)' },
    { label: 'Vendredi', value: 2100, percent: 70, color: 'var(--admin-primary-200)' },
    { label: 'Samedi', value: 2500, percent: 83, color: 'var(--admin-primary-300)' },
    { label: 'Dimanche', value: 1800, percent: 60, color: 'var(--admin-primary-100)' },
  ];

  topFoods = [
    { label: 'Poulet grillé', percent: 85, color: 'var(--admin-primary-300)' },
    { label: 'Riz complet', percent: 72, color: 'var(--admin-primary-200)' },
    { label: 'Banane', percent: 65, color: 'var(--admin-primary-200)' },
    { label: 'Œufs', percent: 60, color: 'var(--admin-primary-100)' },
    { label: 'Avoine', percent: 48, color: 'var(--admin-primary-100)' },
  ];
}
