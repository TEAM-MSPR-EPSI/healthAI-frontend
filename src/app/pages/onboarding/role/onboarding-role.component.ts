import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-onboarding-role',
  standalone: true,
  imports: [],
  templateUrl: './onboarding-role.component.html',
  styleUrl: './onboarding-role.component.css',
})
export class OnboardingRoleComponent {
  selectedRole: 'user' | 'company_admin' | '' = '';
  saving = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  selectRole(role: 'user' | 'company_admin') {
    this.selectedRole = role;
  }

  async next() {
    if (!this.selectedRole || this.saving) {
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    try {
      await this.auth.updateCurrentUserRole(this.selectedRole);

      if (this.selectedRole === 'company_admin') {
        this.router.navigate(['/onboarding/company-contact']);
        return;
      }

      this.router.navigate(['/onboarding/name']);
    } catch {
      this.errorMessage = 'Impossible de sauvegarder votre role.';
    } finally {
      this.saving = false;
    }
  }

  back() {
    this.router.navigate(['/register']);
  }
}
