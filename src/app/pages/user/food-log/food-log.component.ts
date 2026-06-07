// Component: FoodLog | Purpose: Log daily food consumption by date, via recipe or ingredient.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../../services/api.service';

type Mode = 'recipe' | 'ingredient';

interface LoggedRecipe {
  kind: 'recipe';
  recipe_id: number;
  recipe_name: string;
  recipe_type: string;
  ingredients: any[];
}

interface LoggedIngredient {
  kind: 'ingredient';
  ingredient_id: number;
  ingredient_name: string;
  ingredient_type: string;
  grams: number;
  ingredient_energy_100g: number;
  ingredient_protein_100g: number;
  ingredient_carbohydrate_100g: number;
  ingredient_fats_100g: number;
}

type LogEntry = LoggedRecipe | LoggedIngredient;

interface Totals {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

// Structure prête pour l'API consume (POST /consume)
interface ConsumePayload {
  ingredient_id: number;
  ingredient_quantity: number;
  consume_date: string; // ISO date string YYYY-MM-DD
}

@Component({
  selector: 'app-food-log',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatIconModule, MatCardModule, MatButtonModule],
  templateUrl: './food-log.component.html',
  styleUrl: './food-log.component.css',
})
export class FoodLogComponent implements OnInit {
  mode: Mode = 'recipe';

  // --- Date ---
  selectedDate: string = this.toDateString(new Date());
  readonly today: string = this.toDateString(new Date());
  get isToday(): boolean {
    return this.selectedDate === this.toDateString(new Date());
  }

  // --- Recipe search ---
  recipes: any[] = [];
  recipeSearch = '';
  loadingRecipes = true;
  loadingRecipeId: number | null = null;

  // --- Ingredient search ---
  ingredients: any[] = [];
  ingredientSearch = '';
  loadingIngredients = true;
  selectedIngredient: any = null;
  gramsInput: number | null = null;

  // --- Log par date (clé = YYYY-MM-DD) ---
  private logByDate: Map<string, LogEntry[]> = new Map();

  get log(): LogEntry[] {
    return this.logByDate.get(this.selectedDate) ?? [];
  }

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getRecipes().subscribe({
      next: (data) => { this.recipes = data; this.loadingRecipes = false; },
      error: () => { this.loadingRecipes = false; },
    });
    this.api.getIngredients().subscribe({
      next: (data) => { this.ingredients = data; this.loadingIngredients = false; },
      error: () => { this.loadingIngredients = false; },
    });
  }

  // --- Date helpers ---
  toDateString(d: Date): string {
    return d.toISOString().split('T')[0];
  }

  goToPrevDay() {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() - 1);
    this.selectedDate = this.toDateString(d);
  }

  goToNextDay() {
    const d = new Date(this.selectedDate);
    d.setDate(d.getDate() + 1);
    const today = this.toDateString(new Date());
    const next = this.toDateString(d);
    if (next <= today) this.selectedDate = next;
  }

  goToToday() {
    this.selectedDate = this.toDateString(new Date());
  }

  get isNextDayDisabled(): boolean {
    return this.selectedDate >= this.toDateString(new Date());
  }

  formatDisplayDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  // --- Filtered lists ---
  get filteredRecipes() {
    const q = this.recipeSearch.toLowerCase().trim();
    if (!q) return this.recipes;
    return this.recipes.filter(r =>
      r.recipe_name?.toLowerCase().includes(q) ||
      r.recipe_type?.toLowerCase().includes(q)
    );
  }

  get filteredIngredients() {
    const q = this.ingredientSearch.toLowerCase().trim();
    if (!q) return this.ingredients.slice(0, 20);
    return this.ingredients.filter(i =>
      i.ingredient_name?.toLowerCase().includes(q) ||
      i.ingredient_type?.toLowerCase().includes(q)
    ).slice(0, 20);
  }

  // --- Log helpers ---
  private getOrCreateLog(date: string): LogEntry[] {
    if (!this.logByDate.has(date)) this.logByDate.set(date, []);
    return this.logByDate.get(date)!;
  }

  isAlreadyAdded(recipeId: number): boolean {
    return this.log.some(e => e.kind === 'recipe' && (e as LoggedRecipe).recipe_id === recipeId);
  }

  // --- Actions ---
  addRecipe(recipe: any) {
    if (this.isAlreadyAdded(recipe.recipe_id) || this.loadingRecipeId === recipe.recipe_id) return;

    this.loadingRecipeId = recipe.recipe_id;
    this.api.getRecipe(recipe.recipe_id).subscribe({
      next: (detail) => {
        const entry: LoggedRecipe = {
          kind: 'recipe',
          recipe_id: detail.recipe_id,
          recipe_name: detail.recipe_name,
          recipe_type: detail.recipe_type,
          ingredients: detail.ingredients ?? [],
        };
        this.getOrCreateLog(this.selectedDate).push(entry);
        this.loadingRecipeId = null;
        this.recipeSearch = '';

        // Sauvegarde en BDD — éclate la recette en ses ingrédients pour la table consume
        this.recipeToPayloads(entry).forEach(payload =>
          this.api.createConsume(payload).subscribe()
        );
      },
      error: () => { this.loadingRecipeId = null; },
    });
  }

  selectIngredient(ing: any) {
    this.selectedIngredient = ing;
    this.gramsInput = null;
    this.ingredientSearch = ing.ingredient_name;
  }

  addIngredient() {
    if (!this.selectedIngredient || !this.gramsInput || this.gramsInput <= 0) return;

    const entry: LoggedIngredient = {
      kind: 'ingredient',
      ingredient_id: this.selectedIngredient.ingredient_id,
      ingredient_name: this.selectedIngredient.ingredient_name,
      ingredient_type: this.selectedIngredient.ingredient_type,
      grams: this.gramsInput,
      ingredient_energy_100g: this.selectedIngredient.ingredient_energy_100g ?? 0,
      ingredient_protein_100g: this.selectedIngredient.ingredient_protein_100g ?? 0,
      ingredient_carbohydrate_100g: this.selectedIngredient.ingredient_carbohydrate_100g ?? 0,
      ingredient_fats_100g: this.selectedIngredient.ingredient_fats_100g ?? 0,
    };
    this.getOrCreateLog(this.selectedDate).push(entry);

    // Sauvegarde en BDD
    this.api.createConsume({
      ingredient_id: entry.ingredient_id,
      ingredient_quantity: entry.grams,
      consume_date: this.selectedDate,
    }).subscribe();

    this.selectedIngredient = null;
    this.gramsInput = null;
    this.ingredientSearch = '';
  }

  removeEntry(index: number) {
    this.log.splice(index, 1);
  }

  // --- Payload builder (prêt pour l'API) ---
  // Éclate une recette en ses ingrédients pour la table consume
  private recipeToPayloads(entry: LoggedRecipe): ConsumePayload[] {
    return entry.ingredients.map(ing => ({
      ingredient_id: ing.ingredient_id,
      ingredient_quantity: ing.ingredient_quantity ?? 0,
      consume_date: this.selectedDate,
    }));
  }

  // --- Macros ---
  private macrosForEntry(entry: LogEntry): Totals {
    if (entry.kind === 'recipe') {
      return entry.ingredients.reduce((acc: Totals, ing: any) => {
        const g = ing.ingredient_quantity ?? 0;
        acc.calories += (ing.ingredient_energy_100g ?? 0) * g / 100;
        acc.protein  += (ing.ingredient_protein_100g ?? 0) * g / 100;
        acc.carbs    += (ing.ingredient_carbohydrate_100g ?? 0) * g / 100;
        acc.fats     += (ing.ingredient_fats_100g ?? 0) * g / 100;
        return acc;
      }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
    } else {
      const g = entry.grams;
      return {
        calories: entry.ingredient_energy_100g * g / 100,
        protein:  entry.ingredient_protein_100g * g / 100,
        carbs:    entry.ingredient_carbohydrate_100g * g / 100,
        fats:     entry.ingredient_fats_100g * g / 100,
      };
    }
  }

  entryMacros(entry: LogEntry): Totals {
    const t = this.macrosForEntry(entry);
    return {
      calories: Math.round(t.calories),
      protein:  Math.round(t.protein * 10) / 10,
      carbs:    Math.round(t.carbs * 10) / 10,
      fats:     Math.round(t.fats * 10) / 10,
    };
  }

  get totals(): Totals {
    const sum = this.log.reduce((acc, entry) => {
      const t = this.macrosForEntry(entry);
      acc.calories += t.calories;
      acc.protein  += t.protein;
      acc.carbs    += t.carbs;
      acc.fats     += t.fats;
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fats: 0 });
    return {
      calories: Math.round(sum.calories),
      protein:  Math.round(sum.protein * 10) / 10,
      carbs:    Math.round(sum.carbs * 10) / 10,
      fats:     Math.round(sum.fats * 10) / 10,
    };
  }

  setMode(m: Mode) {
    this.mode = m;
    this.recipeSearch = '';
    this.ingredientSearch = '';
    this.selectedIngredient = null;
    this.gramsInput = null;
  }
}
