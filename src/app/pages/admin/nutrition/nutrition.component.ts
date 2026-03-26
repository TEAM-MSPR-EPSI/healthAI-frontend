// Component: Nutrition | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { forkJoin } from 'rxjs';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-nutrition',
  standalone: true,
  imports: [MatCardModule, MatIconModule, NgChartsModule],
  templateUrl: './nutrition.component.html',
  styleUrl: './nutrition.component.css',
})
export class NutritionComponent implements OnInit {
  isLoading = true;
  kpis: Array<{ label: string; value: string; trend: string; up: boolean; icon: string }> = [];

  macroChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  macroChartType: ChartType = 'doughnut';
  caloriesChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  caloriesChartType: ChartType = 'bar';
  topFoodsChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  topFoodsChartType: ChartType = 'bar';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.isLoading = true;
    forkJoin({
      food: this.api.getFood(),
      users: this.api.getUsers(),
    }).subscribe({
      next: ({ food, users }) => {
        const count = Math.max(food.length, 1);
        const avgCalories = this.avg(food, 'food_calories_per_100g');
        const avgProtein = this.avg(food, 'food_protein_per_100g');
        const avgCarbs = this.avg(food, 'food_carbs_per_100g');
        const avgFat = this.avg(food, 'food_fat_per_100g');

        this.kpis = [
          { label: 'Calories moy./100g', value: `${Math.round(avgCalories)}`, trend: `${food.length} aliments`, up: true, icon: 'local_fire_department' },
          { label: 'Protéines moy.', value: `${avgProtein.toFixed(1)} g`, trend: 'Base ingrédients', up: true, icon: 'egg' },
          { label: 'Glucides moy.', value: `${avgCarbs.toFixed(1)} g`, trend: 'Base ingrédients', up: true, icon: 'bakery_dining' },
          { label: 'Lipides moy.', value: `${avgFat.toFixed(1)} g`, trend: `${users.length} utilisateurs`, up: true, icon: 'water_drop' },
        ];

        const totalMacros = Math.max(avgProtein + avgCarbs + avgFat, 1);
        this.macroChartData = {
          labels: ['Protéines', 'Glucides', 'Lipides'],
          datasets: [{
            data: [
              Math.round((avgProtein / totalMacros) * 100),
              Math.round((avgCarbs / totalMacros) * 100),
              Math.round((avgFat / totalMacros) * 100),
            ],
            backgroundColor: ['rgba(46, 125, 50, 0.75)', 'rgba(30, 136, 229, 0.75)', 'rgba(251, 140, 0, 0.75)'],
            borderWidth: 0,
          }],
        };

        const weekdays = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];
        const dailyBaseline = weekdays.map((_, i) => Math.round(avgCalories * (0.88 + (i % 4) * 0.06)));
        this.caloriesChartData = {
          labels: weekdays,
          datasets: [{
            label: 'Calories estimées',
            data: dailyBaseline,
            backgroundColor: 'rgba(30, 136, 229, 0.7)',
            borderRadius: 8,
          }],
        };

        const topFoods = [...food]
          .sort((a, b) => (this.num(b.food_calories_per_100g) - this.num(a.food_calories_per_100g)))
          .slice(0, 5);

        this.topFoodsChartData = {
          labels: topFoods.map((f) => f.food_name || 'Inconnu'),
          datasets: [{
            label: 'Calories / 100g',
            data: topFoods.map((f) => this.num(f.food_calories_per_100g)),
            backgroundColor: 'rgba(251, 140, 0, 0.7)',
            borderRadius: 8,
          }],
        };

        // No endpoint for real daily consumption timeline; estimated from ingredient averages.
        if (count === 1 && food.length === 0) {
          this.kpis[0].trend = 'Aucune donnée';
        }
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
