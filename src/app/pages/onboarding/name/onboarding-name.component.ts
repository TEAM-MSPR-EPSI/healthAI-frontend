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
  saving = false;
  errorMessage = '';

  constructor(private router: Router, private auth: AuthService) {}

  async next() {
    const trimmedFirstName = this.firstName.trim();
    if (!trimmedFirstName) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    try {
      await this.auth.updateCurrentUserFirstName(trimmedFirstName);
      this.router.navigate(['/onboarding/goal']);
    } catch {
      this.errorMessage = 'Impossible de sauvegarder le prenom.';
    } finally {
      this.saving = false;
    }
  }
}
