// Component: OnboardingName | Purpose: Renders and manages UI behavior for this view.
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-onboarding-name',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './onboarding-name.component.html',
  styleUrl: './onboarding-name.component.css',
})
export class OnboardingNameComponent {
  firstName = '';
  lastName = '';
  saving = false;
  errorMessage = '';

  constructor(private router: Router, private auth: AuthService) {}

  async next() {
    const trimmedFirstName = this.firstName.trim();
    const trimmedLastName = this.lastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    try {
      await this.auth.updateCurrentUserProfile({
        user_firstname: trimmedFirstName,
        user_lastname: trimmedLastName,
      });
      this.router.navigate(['/onboarding/personal']);
    } catch {
      this.errorMessage = 'Impossible de sauvegarder votre identite.';
    } finally {
      this.saving = false;
    }
  }

  back() {
    this.router.navigate(['/onboarding/role']);
  }
}
