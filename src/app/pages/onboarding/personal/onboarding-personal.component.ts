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
  city = '';
  country = '';
  saving = false;
  errorMessage = '';
  phoneError = '';
  birthDateError = '';

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
    this.birthDate = '';
    this.gender = user?.user_gender ?? '';
    this.city = user?.user_city ?? '';
    this.country = user?.user_country ?? '';
  }

  isValidPhone(phone: string): boolean {
    const phoneRegex = /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{8})$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  isAdult(birthDate: string): boolean {
    if (!birthDate) return false;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 18;
  }

  validatePhone() {
    const trimmedPhone = this.phone.trim();
    if (trimmedPhone && !this.isValidPhone(trimmedPhone)) {
      this.phoneError = 'Veuillez entrer un numéro de téléphone valide (ex: 0769965399).';
    } else {
      this.phoneError = '';
    }
  }

  validateBirthDate() {
    if (this.birthDate && !this.isAdult(this.birthDate)) {
      this.birthDateError = 'Vous devez avoir au moins 18 ans.';
    } else {
      this.birthDateError = '';
    }
  }

  canContinue(): boolean {
    const trimmedPhone = this.phone.trim();
    
    if (!trimmedPhone || !this.birthDate) {
      return false;
    }

    return this.isValidPhone(trimmedPhone) && this.isAdult(this.birthDate);
  }

  async next() {
    this.validatePhone();
    this.validateBirthDate();

    const trimmedPhone = this.phone.trim();
    
    if (!trimmedPhone || !this.birthDate) {
      this.errorMessage = 'Téléphone et date de naissance sont obligatoires.';
      return;
    }

    if (!this.isValidPhone(trimmedPhone)) {
      this.errorMessage = 'Veuillez entrer un numéro de téléphone valide.';
      return;
    }

    if (!this.isAdult(this.birthDate)) {
      this.errorMessage = 'Vous devez avoir au moins 18 ans.';
      return;
    }

    this.saving = true;
    this.errorMessage = '';

    const payload: Record<string, any> = {};
    if (trimmedPhone) {
      payload['user_phone'] = trimmedPhone;
    }
    if (this.birthDate) {
      payload['user_birth'] = this.birthDate;
    }
    if (this.gender) {
      payload['user_gender'] = this.gender;
    }
    const trimmedCity = this.city.trim();
    if (trimmedCity) {
      payload['user_city'] = trimmedCity;
    }
    const trimmedCountry = this.country.trim();
    if (trimmedCountry) {
      payload['user_country'] = trimmedCountry;
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
