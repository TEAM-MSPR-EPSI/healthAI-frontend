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
  sizeError = '';
  weightError = '';

  private static readonly DEFAULT_SIZE = 170;
  private static readonly DEFAULT_WEIGHT = 70;

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
    const user = this.auth.currentUser();

    const rawSize = user?.user_size ? Number(user.user_size) : null;
    const rawWeight = user?.user_weight ? Number(user.user_weight) : null;

    this.size = rawSize !== null && rawSize !== OnboardingMetricsComponent.DEFAULT_SIZE ? rawSize : null;
    this.weight = rawWeight !== null && rawWeight !== OnboardingMetricsComponent.DEFAULT_WEIGHT ? rawWeight : null;
  }

  async next() {
    this.errorMessage = '';

    const trimmedSize = this.size?.toString().trim();
    const trimmedWeight = this.weight?.toString().trim();

    if (!this.isValidSize(trimmedSize ?? '') || !this.isValidWeight(trimmedWeight ?? '')) {
      this.errorMessage = 'La taille doit être comprise entre 50 et 250 cm, et le poids entre 20 et 300 kg.';
      return;
    }

    this.saving = true;

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

  isValidSize(size: string): boolean {
    const sizeNum = Number(size);
    return !isNaN(sizeNum) && sizeNum >= 50 && sizeNum <= 300;
  }

  isValidWeight(weight: string): boolean {
    const weightNum = Number(weight);
    return !isNaN(weightNum) && weightNum >= 20 && weightNum <= 300;
  }

  validate() {
    const trimmedSize = this.size?.toString().trim();
    const trimmedWeight = this.weight?.toString().trim();

    if (!trimmedSize || !trimmedWeight) {
      this.errorMessage = '';
      return;
    }

    const valid =
      this.isValidSize(trimmedSize) &&
      this.isValidWeight(trimmedWeight);

    this.errorMessage = valid
      ? ''
      : 'La taille doit être comprise entre 50 et 300 cm, et le poids entre 20 et 300 kg.';
  }

  canContinue(): boolean {
    return this.errorMessage === '' && this.size !== null && this.weight !== null;
  }
}