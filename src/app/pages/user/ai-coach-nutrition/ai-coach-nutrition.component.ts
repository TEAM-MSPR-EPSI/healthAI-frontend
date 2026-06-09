import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';

interface DailyMacros {
  calories: number;
  proteins: number;
  carbs: number;
  fat: number;
}

interface MealPlanResult {
  plan_id: string;
  meal_plan: string;
  daily_macros?: DailyMacros;
}

interface NutritionForm {
  user_id: number;
  goal: string;
  diet: string;
  days: number;
  meals_per_day: number;
  allergies: string[];
}

@Component({
  selector: 'app-ai-coach-nutrition',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './ai-coach-nutrition.component.html',
  styleUrl: './ai-coach-nutrition.component.css',
})
export class AiCoachNutritionComponent {

  isLoading = false;
  errorMsg = '';
  result: MealPlanResult | null = null;

  form: NutritionForm = {
    user_id: 1,
    goal: 'weight_loss',
    diet: 'standard',
    days: 7,
    meals_per_day: 3,
    allergies: [],
  };

  goals = [
    { value: 'weight_loss',   label: 'Perte de poids',  icon: '🔥' },
    { value: 'muscle_gain',   label: 'Prise de masse',  icon: '💪' },
    { value: 'maintenance',   label: 'Maintien',         icon: '⚖️' },
    { value: 'energy',        label: 'Énergie',          icon: '⚡' },
    { value: 'health',        label: 'Santé générale',   icon: '🫀' },
  ];

  diets = [
    { value: 'standard',     label: 'Standard',       icon: '🍽️' },
    { value: 'vegetarian',   label: 'Végétarien',     icon: '🥗' },
    { value: 'vegan',        label: 'Vegan',           icon: '🌱' },
    { value: 'keto',         label: 'Keto',            icon: '🥑' },
    { value: 'mediterranean',label: 'Méditerranéen',   icon: '🫒' },
  ];

  allergies = [
    { value: 'gluten',      label: 'Gluten' },
    { value: 'lactose',     label: 'Lactose' },
    { value: 'nuts',        label: 'Fruits à coque' },
    { value: 'eggs',        label: 'Œufs' },
    { value: 'fish',        label: 'Poisson' },
    { value: 'soy',         label: 'Soja' },
  ];

  constructor(private http: HttpClient) {}

  isAllergySelected(val: string): boolean {
    return this.form.allergies.includes(val);
  }

  toggleAllergy(val: string): void {
    const idx = this.form.allergies.indexOf(val);
    if (idx === -1) {
      this.form.allergies = [...this.form.allergies, val];
    } else {
      this.form.allergies = this.form.allergies.filter(a => a !== val);
    }
  }

  increment(field: 'days' | 'meals'): void {
    if (field === 'days' && this.form.days < 7) this.form.days++;
    if (field === 'meals' && this.form.meals_per_day < 6) this.form.meals_per_day++;
  }

  decrement(field: 'days' | 'meals'): void {
    if (field === 'days' && this.form.days > 1) this.form.days--;
    if (field === 'meals' && this.form.meals_per_day > 2) this.form.meals_per_day--;
  }

  generate(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.result = null;

    this.http.post<MealPlanResult>(
      '/nutrition/meal-plan/generate',
      this.form
    ).subscribe({
      next: (res) => {
        this.result = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.detail ?? 'Une erreur est survenue. Vérifie que le service nutrition est démarré.';
        this.isLoading = false;
      }
    });
  }

  reset(): void {
    this.result = null;
    this.errorMsg = '';
  }

  copyPlan(): void {
    if (this.result?.meal_plan) {
      navigator.clipboard.writeText(this.result.meal_plan);
    }
  }
}
