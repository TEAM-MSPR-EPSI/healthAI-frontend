import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-onboarding-metrics',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './onboarding-metrics.component.html',
  styleUrl: './onboarding-metrics.component.css',
})
export class OnboardingMetricsComponent {
  size: number | null = null;
  weight: number | null = null;
  saving = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
    const user = this.auth.currentUser();
    this.size = user?.user_size ? Number(user.user_size) : null;
    this.weight = user?.user_weight ? Number(user.user_weight) : null;
  }

  async next() {
    this.saving = true;
    this.errorMessage = '';

    const payload: Record<string, any> = {};
    if (this.size && this.size > 0) {
      payload['user_size'] = this.size;
    }
    if (this.weight && this.weight > 0) {
      payload['user_weight'] = this.weight;
      payload['user_last_weight'] = this.weight;
    }

    try {
      if (Object.keys(payload).length) {
        await this.auth.updateCurrentUserProfile(payload);
      }
      this.router.navigate(['/onboarding/goal']);
    } catch {
      this.errorMessage = 'Impossible de sauvegarder votre taille et votre poids.';
    } finally {
      this.saving = false;
    }
  }

  back() {
    this.router.navigate(['/onboarding/personal']);
  }
}
