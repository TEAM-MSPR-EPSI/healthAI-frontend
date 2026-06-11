import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';

interface ExerciceScore {
  name: string;
  score: number;
  equipment: string[];
  limitations_incompatible: string[];
}

interface RecommandationResult {
  recommandation_id: string;
  exercices_scores: ExerciceScore[];
  plan_genere: string;
}

interface ExercicesForm {
  user_id: number;
  goal: string;
  level: string;
  equipment: string[];
  sessions_per_week: number;
  session_duration_minutes: number;
  limitations: string[];
  preferred_activities: string[];
}

@Component({
  selector: 'app-ai-coach-exercices',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './ai-coach-exercices.component.html',
  styleUrl: './ai-coach-exercices.component.css',
})
export class AiCoachExercicesComponent {

  isLoading = false;
  errorMsg = '';
  result: RecommandationResult | null = null;

  form: ExercicesForm = {
    user_id: 1,
    goal: 'weight_loss',
    level: 'beginner',
    equipment: ['none'],
    sessions_per_week: 3,
    session_duration_minutes: 45,
    limitations: [],
    preferred_activities: [],
  };

  goals = [
    { value: 'weight_loss',  label: 'Perte de poids',   icon: '🔥' },
    { value: 'muscle_gain',  label: 'Prise de masse',   icon: '💪' },
    { value: 'endurance',    label: 'Endurance',         icon: '🏃' },
    { value: 'flexibility',  label: 'Flexibilité',       icon: '🧘' },
    { value: 'maintenance',  label: 'Maintien',          icon: '⚖️' },
  ];

  levels = [
    { value: 'beginner',     label: 'Débutant' },
    { value: 'intermediate', label: 'Intermédiaire' },
    { value: 'advanced',     label: 'Avancé' },
  ];

  durations = [30, 45, 60];

  equipments = [
    { value: 'none',       label: 'Sans matériel',  icon: '🤸' },
    { value: 'mat',        label: 'Tapis',          icon: '🟩' },
    { value: 'dumbbells',  label: 'Haltères',       icon: '🏋️' },
    { value: 'barbell',    label: 'Barre',          icon: '🔩' },
    { value: 'bands',      label: 'Élastiques',     icon: '🔄' },
    { value: 'machine',    label: 'Machine',        icon: '⚙️' },
  ];

  limitations = [
    { value: 'lower_back', label: 'Dos bas' },
    { value: 'knee',       label: 'Genou' },
    { value: 'shoulder',   label: 'Épaule' },
  ];

  constructor(private http: HttpClient) {}

  isEquipmentSelected(val: string): boolean {
    return this.form.equipment.includes(val);
  }

  toggleEquipment(val: string): void {
    const idx = this.form.equipment.indexOf(val);
    if (idx === -1) {
      this.form.equipment = [...this.form.equipment, val];
    } else {
      this.form.equipment = this.form.equipment.filter(e => e !== val);
      if (this.form.equipment.length === 0) {
        this.form.equipment = ['none'];
      }
    }
  }

  isLimitationSelected(val: string): boolean {
    return this.form.limitations.includes(val);
  }

  toggleLimitation(val: string): void {
    const idx = this.form.limitations.indexOf(val);
    if (idx === -1) {
      this.form.limitations = [...this.form.limitations, val];
    } else {
      this.form.limitations = this.form.limitations.filter(l => l !== val);
    }
  }

  increment(field: 'sessions'): void {
    if (this.form.sessions_per_week < 6) this.form.sessions_per_week++;
  }

  decrement(field: 'sessions'): void {
    if (this.form.sessions_per_week > 2) this.form.sessions_per_week--;
  }

  generate(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.result = null;

    this.http.post<RecommandationResult>(
      '/exercices/recommander',
      this.form
    ).subscribe({
      next: (res) => {
        this.result = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.detail ?? 'Une erreur est survenue. Vérifie que le service est démarré.';
        this.isLoading = false;
      }
    });
  }

  reset(): void {
    this.result = null;
    this.errorMsg = '';
  }

  copyPlan(): void {
    if (this.result?.plan_genere) {
      navigator.clipboard.writeText(this.result.plan_genere);
    }
  }
}