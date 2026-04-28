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

  usageChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  usageChartType: ChartType = 'doughnut';
  caloriesChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  caloriesChartType: ChartType = 'bar';
  topFoodsChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  topFoodsChartType: ChartType = 'bar';
  leastUsedFoodsChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  leastUsedFoodsChartType: ChartType = 'bar';

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.isLoading = true;

    forkJoin({
      food: this.api.getFood(),
      consumes: this.api.getConsumesAll(),
    }).subscribe({
      next: ({ food, consumes }: { food: any[]; consumes: any[] }) => {
        const ingredientStats = this.buildIngredientStats(consumes, food);
        const totalConsumed = consumes.length;
        const activeUsers = new Set(consumes.map((consume) => this.num(consume.user_id))).size;
        const calorieSeries = this.buildDailyCaloriesSeries(consumes, food);
        const totalCalories = calorieSeries.data.reduce((sum, value) => sum + this.num(value), 0);
        const topIngredient = ingredientStats[0];

        this.kpis = [
          { label: 'Consommations', value: `${totalConsumed}`, trend: `${activeUsers} utilisateurs actifs`, up: true, icon: 'restaurant' },
          { label: 'Ingrédients distincts', value: `${ingredientStats.length}`, trend: 'Usage réel', up: true, icon: 'shopping_basket' },
          { label: 'Top ingrédient', value: topIngredient?.label || 'N/A', trend: `${topIngredient?.count || 0} consommations`, up: true, icon: 'star' },
          { label: 'Calories sur 7 jours', value: `${Math.round(totalCalories)}`, trend: 'Estimation hebdomadaire', up: true, icon: 'local_fire_department' },
        ];

        const topUsage = ingredientStats.slice(0, 6);
        const bottomUsage = ingredientStats.slice(-6).reverse();

        this.usageChartData = {
          labels: topUsage.map((item) => item.label),
          datasets: [
            {
              data: topUsage.map((item) => item.count),
              backgroundColor: [
                'rgba(79, 99, 53, 0.85)',
                'rgba(159, 180, 109, 0.85)',
                'rgba(191, 143, 63, 0.85)',
                'rgba(139, 107, 76, 0.85)',
                'rgba(86, 101, 117, 0.85)',
                'rgba(120, 146, 94, 0.85)',
              ],
              borderWidth: 0,
            },
          ],
        };

        this.caloriesChartData = {
          labels: calorieSeries.labels,
          datasets: [
            {
              label: 'Calories consommées',
              data: calorieSeries.data,
              backgroundColor: '#4f6335',
              borderRadius: 8,
            },
          ],
        };

        const topFoods = [...food]
          .sort((a, b) => this.num(b.food_calories_per_100g) - this.num(a.food_calories_per_100g))
          .slice(0, 5);

        this.topFoodsChartData = {
          labels: topUsage.map((item) => item.label),
          datasets: [
            {
              label: 'Consommations',
              data: topUsage.map((item) => item.count),
              backgroundColor: '#8b6b4c',
              borderRadius: 8,
            },
          ],
        };

        this.leastUsedFoodsChartData = {
          labels: bottomUsage.map((item) => item.label),
          datasets: [
            {
              label: 'Consommations',
              data: bottomUsage.map((item) => item.count),
              backgroundColor: '#bfbfbf',
              borderRadius: 8,
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

  private num(value: unknown): number {
    const n = Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private avg(items: any[], key: string): number {
    if (!items.length) return 0;
    const sum = items.reduce((acc, item) => acc + this.num(item[key]), 0);
    return sum / items.length;
  }

  private buildIngredientStats(consumes: any[], food: any[]): Array<{ id: number; label: string; count: number; totalCalories: number }> {
    const foodById = new Map<number, any>();

    food.forEach((item) => {
      const id = this.num(item.ingredient_id ?? item.food_id ?? item.id);
      if (id) {
        foodById.set(id, item);
      }
    });

    const statsById = new Map<number, { id: number; label: string; count: number; totalCalories: number }>();

    consumes.forEach((consume) => {
      const ingredientId = this.num(consume.ingredient_id ?? consume.Ingredient?.ingredient_id ?? consume.ingredient?.ingredient_id);
      if (!ingredientId) {
        return;
      }

      const ingredient = foodById.get(ingredientId) ?? consume.Ingredient ?? consume.ingredient ?? {};
      const label = ingredient.food_name || ingredient.ingredient_name || `Ingrédient ${ingredientId}`;
      const caloriesPer100g = this.num(ingredient.food_calories_per_100g ?? ingredient.ingredient_energy_100g);
      const quantity = this.num(consume.ingredient_quantity);
      const calories = (quantity / 100) * caloriesPer100g;

      const current = statsById.get(ingredientId) ?? { id: ingredientId, label, count: 0, totalCalories: 0 };
      current.count += 1;
      current.totalCalories += calories;
      statsById.set(ingredientId, current);
    });

    return Array.from(statsById.values())
      .sort((a, b) => b.count - a.count || b.totalCalories - a.totalCalories || a.label.localeCompare(b.label));
  }

  private buildDailyCaloriesSeries(consumes: any[], food: any[]): { labels: string[]; data: number[] } {
    if (!consumes.length) {
      return {
        labels: ['Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.', 'Dim.'],
        data: [0, 0, 0, 0, 0, 0, 0],
      };
    }

    const foodById = new Map<number, any>();
    food.forEach((item) => {
      const id = this.num(item.ingredient_id ?? item.food_id ?? item.id);
      if (id) {
        foodById.set(id, item);
      }
    });

    const consumeDates = consumes
      .map((consume) => String(consume.consume_date || '').slice(0, 10))
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b));

    const latestDate = consumeDates[consumeDates.length - 1];
    const endDate = new Date(`${latestDate}T00:00:00`);
    const windowDates: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const currentDate = new Date(endDate);
      currentDate.setDate(currentDate.getDate() - i);
      windowDates.push(currentDate.toISOString().split('T')[0]);
    }

    const caloriesByDay = new Map<string, number>();
    windowDates.forEach((date) => caloriesByDay.set(date, 0));

    consumes.forEach((consume) => {
      const dateKey = String(consume.consume_date || '').slice(0, 10);
      if (!caloriesByDay.has(dateKey)) {
        return;
      }

      const ingredientId = this.num(consume.ingredient_id ?? consume.Ingredient?.ingredient_id ?? consume.ingredient?.ingredient_id);
      const ingredient = foodById.get(ingredientId) ?? consume.Ingredient ?? consume.ingredient ?? {};
      const caloriesPer100g = this.num(ingredient.food_calories_per_100g ?? ingredient.ingredient_energy_100g);
      const quantity = this.num(consume.ingredient_quantity);
      const calories = (quantity / 100) * caloriesPer100g;

      caloriesByDay.set(dateKey, (caloriesByDay.get(dateKey) || 0) + calories);
    });

    const dayNames = ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'];

    return {
      labels: windowDates.map((date) => dayNames[new Date(`${date}T00:00:00`).getDay()]),
      data: windowDates.map((date) => Math.round(caloriesByDay.get(date) || 0)),
    };
  }
}
