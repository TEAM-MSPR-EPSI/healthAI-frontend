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
  firstNameError = '';
  lastNameError = '';

  constructor(private router: Router, private auth: AuthService) {}

  isValidName(name: string): boolean {
    const nameRegex = /^[a-zA-Zàâäæçéèêëïîôöœùûüœ\s\-']+$/;
    return nameRegex.test(name.trim());
  }

  validateFirstName() {
    if (this.firstName.trim() && !this.isValidName(this.firstName)) {
      this.firstNameError = 'Le prénom ne doit contenir que des lettres, espaces, traits d\'union ou apostrophes.';
    } else {
      this.firstNameError = '';
    }
  }

  validateLastName() {
    if (this.lastName.trim() && !this.isValidName(this.lastName)) {
      this.lastNameError = 'Le nom ne doit contenir que des lettres, espaces, traits d\'union ou apostrophes.';
    } else {
      this.lastNameError = '';
    }
  }

  canContinue(): boolean {
    const trimmedFirstName = this.firstName.trim();
    const trimmedLastName = this.lastName.trim();
    
    if (!trimmedFirstName || !trimmedLastName) {
      return false;
    }
    
    return this.isValidName(trimmedFirstName) && this.isValidName(trimmedLastName);
  }

  async next() {
    const trimmedFirstName = this.firstName.trim();
    const trimmedLastName = this.lastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      return;
    }

    if (!this.isValidName(trimmedFirstName) || !this.isValidName(trimmedLastName)) {
      this.errorMessage = 'Le prénom et le nom ne doivent contenir que des lettres, espaces, traits d\'union ou apostrophes.';
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
