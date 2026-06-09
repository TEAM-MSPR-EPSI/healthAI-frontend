import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../../services/auth.service';
import { catchError, of } from 'rxjs';

interface Meal {
  name: string;
  type: string;
  foods: string[];
  estimated_calories: number;
  prep_time_min: number;
}

interface DayPlan {
  day: number;
  meals: Meal[];
  total_calories: number;
}

interface MealPlanResult {
  user_id: number;
  plan: DayPlan[];
  weekly_notes: string[];
}

interface NutritionForm {
  goal: string;
  diet: string;
  days: number;
  meals_per_day: number;
  allergies: string[];
}

// Valeurs frontend → valeurs attendues par le backend nutrition
const OBJECTIVE_MAP: Record<string, string> = {
  weight_loss:  'weight_loss',
  muscle_gain:  'muscle_gain',
  maintenance:  'maintenance',
  energy:       'endurance',
  health:       'maintenance',
};

const DIET_MAP: Record<string, string> = {
  standard:      'none',
  vegetarian:    'vegetarian',
  vegan:         'vegan',
  keto:          'none',
  mediterranean: 'none',
};

// Valeurs backend (PostgreSQL) → valeurs affichées dans le formulaire
const OBJECTIVE_FROM_DB: Record<string, string> = {
  weight_loss: 'weight_loss',
  muscle_gain: 'muscle_gain',
  maintenance: 'maintenance',
  endurance:   'energy',
  flexibility: 'maintenance',
  cardio:      'energy',
};

const DIET_FROM_DB: Record<string, string> = {
  none:         'standard',
  vegetarian:   'vegetarian',
  vegan:        'vegan',
  gluten_free:  'standard',
  lactose_free: 'standard',
  pescatarian:  'standard',
  halal:        'standard',
  kosher:       'standard',
  balanced:     'standard',
  low_carb:     'standard',
  keto:         'keto',
};

// Valeurs allergies PostgreSQL → valeurs des chips du formulaire
const ALLERGY_FROM_DB: Record<string, string> = {
  peanuts: 'nuts',
  milk:    'lactose',
  gluten:  'gluten',
  eggs:    'eggs',
  fish:    'fish',
  soy:     'soy',
  nuts:    'nuts',
};

@Component({
  selector: 'app-ai-coach-nutrition',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './ai-coach-nutrition.component.html',
  styleUrl: './ai-coach-nutrition.component.css',
})
export class AiCoachNutritionComponent implements OnInit {

  isLoading = false;
  isLoadingProfile = true;
  errorMsg = '';
  result: MealPlanResult | null = null;

  form: NutritionForm = {
    goal: 'maintenance',
    diet: 'standard',
    days: 7,
    meals_per_day: 3,
    allergies: [],
  };

  goals = [
    { value: 'weight_loss', label: 'Perte de poids', icon: '🔥' },
    { value: 'muscle_gain', label: 'Prise de masse',  icon: '💪' },
    { value: 'maintenance', label: 'Maintien',         icon: '⚖️' },
    { value: 'energy',      label: 'Énergie',          icon: '⚡' },
    { value: 'health',      label: 'Santé générale',   icon: '🫀' },
  ];

  diets = [
    { value: 'standard',      label: 'Standard',      icon: '🍽️' },
    { value: 'vegetarian',    label: 'Végétarien',    icon: '🥗' },
    { value: 'vegan',         label: 'Vegan',          icon: '🌱' },
    { value: 'keto',          label: 'Keto',           icon: '🥑' },
    { value: 'mediterranean', label: 'Méditerranéen',  icon: '🫒' },
  ];

  allergies = [
    { value: 'gluten',  label: 'Gluten' },
    { value: 'lactose', label: 'Lactose' },
    { value: 'nuts',    label: 'Fruits à coque' },
    { value: 'eggs',    label: 'Œufs' },
    { value: 'fish',    label: 'Poisson' },
    { value: 'soy',     label: 'Soja' },
  ];

  constructor(
    private http: HttpClient,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    if (!this.auth.currentUser()) {
      this.isLoadingProfile = false;
      return;
    }

    this.http.get<any>('/nutrition/api/meal-plan/profile').pipe(
      catchError(() => of(null))
    ).subscribe(profile => {
      if (profile) {
        const dbObj  = (profile.objective ?? '').toLowerCase().trim();
        const dbDiet = (profile.diet      ?? '').toLowerCase().trim();
        this.form.goal = OBJECTIVE_FROM_DB[dbObj]  ?? 'maintenance';
        this.form.diet = DIET_FROM_DB[dbDiet]      ?? 'standard';

        if (Array.isArray(profile.allergies) && profile.allergies.length) {
          const validValues = new Set(this.allergies.map(a => a.value));
          this.form.allergies = profile.allergies
            .map((raw: string) => ALLERGY_FROM_DB[raw.toLowerCase().trim()] ?? raw.toLowerCase().trim())
            .filter((v: string) => validValues.has(v));
        }
      }
      this.isLoadingProfile = false;
    });
  }

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
    if (field === 'days'  && this.form.days < 7)          this.form.days++;
    if (field === 'meals' && this.form.meals_per_day < 6) this.form.meals_per_day++;
  }

  decrement(field: 'days' | 'meals'): void {
    if (field === 'days'  && this.form.days > 1)          this.form.days--;
    if (field === 'meals' && this.form.meals_per_day > 2) this.form.meals_per_day--;
  }

  generate(): void {
    this.isLoading = true;
    this.errorMsg  = '';
    this.result    = null;

    const payload = {
      days:          this.form.days,
      meals_per_day: this.form.meals_per_day,
      objective:     OBJECTIVE_MAP[this.form.goal]  ?? this.form.goal,
      diet:          DIET_MAP[this.form.diet]        ?? this.form.diet,
      allergies:     this.form.allergies,
    };

    this.http.post<MealPlanResult>('/nutrition/api/meal-plan/generate', payload).subscribe({
      next: (res) => {
        this.result    = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg  = err?.error?.detail ?? 'Une erreur est survenue. Vérifie que le service nutrition est démarré.';
        this.isLoading = false;
      },
    });
  }

  reset(): void {
    this.result   = null;
    this.errorMsg = '';
  }

  copyPlan(): void {
    if (!this.result) return;
    const text = this.result.plan.map(day => {
      const meals = day.meals.map(m =>
        `  ${m.type} : ${m.name} (${m.estimated_calories} kcal)`
      ).join('\n');
      return `Jour ${day.day} — ${day.total_calories} kcal\n${meals}`;
    }).join('\n\n');
    navigator.clipboard.writeText(text);
  }
}
