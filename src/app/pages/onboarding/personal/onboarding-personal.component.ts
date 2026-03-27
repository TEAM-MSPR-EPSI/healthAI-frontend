import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-onboarding-personal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './onboarding-personal.component.html',
  styleUrl: './onboarding-personal.component.css',
})
export class OnboardingPersonalComponent {
  phone = '';
  birthDate = '';
  gender = '';
  saving = false;
  errorMessage = '';

  readonly genderOptions = [
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
    { value: 'other', label: 'Autre' },
    { value: 'prefer_not_to_say', label: 'Je prefere ne pas repondre' },
  ];

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {
    const user = this.auth.currentUser();
    this.phone = user?.user_phone ?? '';
    this.birthDate = user?.user_birth ?? '';
    this.gender = user?.user_gender ?? '';
  }

  async next() {
    this.saving = true;
    this.errorMessage = '';

    const payload: Record<string, any> = {};
    const trimmedPhone = this.phone.trim();
    if (trimmedPhone) {
      payload['user_phone'] = trimmedPhone;
    }
    if (this.birthDate) {
      payload['user_birth'] = this.birthDate;
    }
    if (this.gender) {
      payload['user_gender'] = this.gender;
    }

    try {
      if (Object.keys(payload).length) {
        await this.auth.updateCurrentUserProfile(payload);
      }
      this.router.navigate(['/onboarding/metrics']);
    } catch {
      this.errorMessage = 'Impossible de sauvegarder ces informations.';
    } finally {
      this.saving = false;
    }
  }

  back() {
    this.router.navigate(['/onboarding/name']);
  }
}
