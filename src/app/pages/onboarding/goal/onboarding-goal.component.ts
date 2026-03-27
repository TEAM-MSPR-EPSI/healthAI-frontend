// Component: OnboardingGoal | Purpose: Renders and manages UI behavior for this view.
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-onboarding-goal',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './onboarding-goal.component.html',
  styleUrl: './onboarding-goal.component.css',
})
export class OnboardingGoalComponent {
  selectedGoal = '';
  selectedProgramId: number | null = null;
  saving = false;
  programOptions: Array<{ sport_program_id: number; sport_program_name: string }> = [];
  errorMessage = '';

  goals = [
    { value: 'weight_loss', label: 'Perdre du poids' },
    { value: 'muscle_gain', label: 'Prendre du muscle' },
    { value: 'fitness', label: 'Améliorer ma forme' },
    { value: 'nutrition', label: 'Manger mieux' },
  ];

  constructor(
    private router: Router,
    private auth: AuthService,
    private api: ApiService,
  ) {
    this.loadPrograms();
  }

  private loadPrograms() {
    this.api.getPrograms().subscribe({
      next: (programs) => {
        this.programOptions = programs ?? [];
      },
      error: () => {
        this.programOptions = [];
      },
    });
  }

  selectGoal(value: string) {
    this.selectedGoal = value;
  }

  async next() {
    this.saving = true;
    this.errorMessage = '';

    try {
      await this.auth.updateCurrentUserProfile({
        sport_program_id: this.selectedProgramId,
      });
      this.router.navigate(['/recipes']);
    } catch {
      this.errorMessage = 'Impossible de sauvegarder votre programme sportif.';
    } finally {
      this.saving = false;
    }
  }

  back() {
    this.router.navigate(['/onboarding/metrics']);
  }
}
