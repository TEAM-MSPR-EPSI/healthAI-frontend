// Component: Profile | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  loadingPrograms = false;
  loadingAllergies = false;
  loadingBiometrics = false;
  loadingConsumes = false;
  loadingIngredients = false;
  savingProfile = false;

  profile = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: null as Date | null,
    gender: '',
    city: '',
    country: '',
    height: null as number | null,
    weight: null as number | null,
    sportProgramId: null as number | null,
    sportProgramName: '',
    goal: '',
  };

  sportPrograms: Array<{ sport_program_id: number; sport_program_name: string }> = [];
  ingredients: any[] = [];
  userAllergies: string[] = [];
  selectedAllergies: string[] = [];
  userBiometrics: any[] = [];
  userConsumes: any[] = [];
  newBiometricDate = '';
  newBiometricSleep: number | null = null;
  newBiometricSteps: number | null = null;
  newBiometricWeight: number | null = null;
  newConsumeDate = '';
  newConsumeIngredientId: number | null = null;
  newConsumeQuantity: number | null = null;

  readonly allergiesList = [
    'gluten',
    'crustaceans',
    'eggs',
    'fish',
    'peanuts',
    'soybeans',
    'milk',
    'nuts',
    'celery',
    'mustard',
    'sesame',
    'sulphites',
    'lupin',
    'molluscs',
  ];

  goals = [
    { value: 'weight_loss', label: 'Perte de poids' },
    { value: 'muscle_gain', label: 'Prise de masse' },
    { value: 'fitness', label: 'Remise en forme' },
    { value: 'maintenance', label: 'Maintien' },
  ];

  private userId: string | null = null;

  constructor(
    private auth: AuthService,
    private api: ApiService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit() {
    this.newBiometricDate = new Date().toISOString().slice(0, 10);
    this.newConsumeDate = new Date().toISOString().slice(0, 10);

    const user = this.auth.currentUser();
    if (user) {
      this.userId = user.user_id;
      this.profile = {
        firstName: user.user_firstname ?? '',
        lastName: user.user_lastname ?? '',
        email: user.user_email ?? '',
        phone: user.user_phone ?? '',
        birthDate: user.user_birth ? new Date(user.user_birth) : null,
        gender: user.user_gender ?? '',
        city: user.user_city ?? '',
        country: user.user_country ?? '',
        height: user.user_size ? Number(user.user_size) : null,
        weight: user.user_weight ? Number(user.user_weight) : null,
        sportProgramId: user.sport_program_id ? Number(user.sport_program_id) : null,
        sportProgramName: '',
        goal: '',
      };
    }

    if (!this.userId) {
      return;
    }

    this.loadingPrograms = true;
    this.api.getPrograms().subscribe({
      next: (programs) => {
        this.sportPrograms = programs ?? [];
        const selected = this.sportPrograms.find(p => p.sport_program_id === this.profile.sportProgramId);
        if (selected) {
          this.profile.sportProgramName = selected.sport_program_name;
        }
        this.loadingPrograms = false;
      },
      error: () => {
        this.sportPrograms = [];
        this.loadingPrograms = false;
      },
    });

    this.loadUserAllergies();
    this.loadUserBiometrics();
    this.loadUserConsumes();
    this.loadIngredients();
  }

  private loadUserAllergies(): void {
    if (!this.userId) return;
    this.loadingAllergies = true;
    this.api.getUserAllergies(this.userId).subscribe({
      next: (allergies) => {
        this.userAllergies = allergies ?? [];
        this.selectedAllergies = [...this.userAllergies];
        this.loadingAllergies = false;
      },
      error: () => {
        this.userAllergies = [];
        this.selectedAllergies = [];
        this.loadingAllergies = false;
      },
    });
  }

  private loadUserBiometrics(): void {
    if (!this.userId) return;
    this.loadingBiometrics = true;
    this.api.getUserBiometrics(this.userId).subscribe({
      next: (biometrics) => {
        this.userBiometrics = (biometrics ?? []).sort(
          (a, b) => new Date(b.biometric_date).getTime() - new Date(a.biometric_date).getTime(),
        );
        this.loadingBiometrics = false;
      },
      error: () => {
        this.userBiometrics = [];
        this.loadingBiometrics = false;
      },
    });
  }

  private loadUserConsumes(): void {
    if (!this.userId) return;
    this.loadingConsumes = true;
    this.api.getUserConsumes(this.userId).subscribe({
      next: (consumes) => {
        this.userConsumes = (consumes ?? []).slice(0, 20);
        this.loadingConsumes = false;
      },
      error: () => {
        this.userConsumes = [];
        this.loadingConsumes = false;
      },
    });
  }

  private loadIngredients(): void {
    this.loadingIngredients = true;
    this.api.getFood().subscribe({
      next: (ingredients) => {
        this.ingredients = ingredients ?? [];
        this.loadingIngredients = false;
      },
      error: () => {
        this.ingredients = [];
        this.loadingIngredients = false;
      },
    });
  }

  save() {
    if (!this.userId) return;
    this.savingProfile = true;
    const payload = {
      user_firstname: this.profile.firstName,
      user_lastname: this.profile.lastName,
      user_email: this.profile.email,
      user_phone: this.profile.phone,
      user_birth: this.profile.birthDate?.toISOString().split('T')[0],
      user_gender: this.profile.gender,
      user_city: this.profile.city || null,
      user_country: this.profile.country || null,
      user_size: this.profile.height,
      user_weight: this.profile.weight,
      user_last_weight: this.profile.weight,
      sport_program_id: this.profile.sportProgramId,
    };
    this.api.updateUser(this.userId, payload).subscribe({
      next: () => {
        this.savingProfile = false;
        this.snackBar.open('Profil sauvegardé', 'OK', { duration: 2500 });
      },
      error: () => {
        this.savingProfile = false;
        this.snackBar.open('Erreur lors de la sauvegarde', 'OK', { duration: 3000 });
      },
    });
  }

  onProgramChange() {
    const selected = this.sportPrograms.find(p => p.sport_program_id === this.profile.sportProgramId);
    this.profile.sportProgramName = selected?.sport_program_name ?? '';
  }

  saveAllergies(): void {
    if (!this.userId) return;
    this.api.setUserAllergies(this.userId, this.selectedAllergies).subscribe({
      next: () => {
        this.userAllergies = [...this.selectedAllergies];
        this.snackBar.open('Allergies mises à jour', 'OK', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de la mise à jour des allergies', 'OK', { duration: 3000 });
      },
    });
  }

  addBiometric(): void {
    if (!this.userId || !this.newBiometricDate) {
      this.snackBar.open('Date biométrique requise', 'OK', { duration: 2500 });
      return;
    }

    const payload = {
      user_id: this.userId,
      biometric_date: this.newBiometricDate,
      biometric_sleep: this.newBiometricSleep,
      biometric_steps: this.newBiometricSteps,
      biometric_weight: this.newBiometricWeight,
    };

    this.api.createUserBiometric(payload).subscribe({
      next: () => {
        this.newBiometricSleep = null;
        this.newBiometricSteps = null;
        this.newBiometricWeight = null;
        this.loadUserBiometrics();
        this.snackBar.open('Entrée biométrique ajoutée', 'OK', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'ajout biométrique', 'OK', { duration: 3000 });
      },
    });
  }

  deleteBiometric(id: number): void {
    this.api.deleteUserBiometric(id).subscribe({
      next: () => {
        this.loadUserBiometrics();
        this.snackBar.open('Entrée biométrique supprimée', 'OK', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression', 'OK', { duration: 3000 });
      },
    });
  }

  addConsume(): void {
    if (!this.userId || !this.newConsumeDate || !this.newConsumeIngredientId || !this.newConsumeQuantity) {
      this.snackBar.open('Date, aliment et quantité sont requis', 'OK', { duration: 2500 });
      return;
    }

    const payload = {
      user_id: this.userId,
      ingredient_id: this.newConsumeIngredientId,
      ingredient_quantity: this.newConsumeQuantity,
      consume_date: this.newConsumeDate,
    };

    this.api.createConsume(payload).subscribe({
      next: () => {
        this.newConsumeIngredientId = null;
        this.newConsumeQuantity = null;
        this.loadUserConsumes();
        this.snackBar.open('Consommation ajoutée', 'OK', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de l\'ajout consommation', 'OK', { duration: 3000 });
      },
    });
  }

  deleteConsume(id: number): void {
    this.api.deleteConsume(id).subscribe({
      next: () => {
        this.loadUserConsumes();
        this.snackBar.open('Consommation supprimée', 'OK', { duration: 2500 });
      },
      error: () => {
        this.snackBar.open('Erreur lors de la suppression', 'OK', { duration: 3000 });
      },
    });
  }

  toggleAllergy(allergy: string): void {
    const idx = this.selectedAllergies.indexOf(allergy);
    if (idx >= 0) {
      this.selectedAllergies.splice(idx, 1);
    } else {
      this.selectedAllergies.push(allergy);
    }
  }

  isAllergySelected(allergy: string): boolean {
    return this.selectedAllergies.includes(allergy);
  }

  formatAllergyLabel(allergy: string): string {
    return allergy.replaceAll('_', ' ').replace(/(^|\s)\w/g, (m) => m.toUpperCase());
  }

  formatSleepHours(minutes: number | null | undefined): string {
    if (!minutes) return '-';
    return (minutes / 60).toFixed(1);
  }
}

