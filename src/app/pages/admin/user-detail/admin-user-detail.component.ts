import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

interface AdminUserForm {
  user_username: string;
  user_lastname: string;
  user_firstname: string;
  user_email: string;
  user_phone: string;
  user_birth: string;
  user_role: string;
  user_gender: string;
  user_city: string;
  user_country: string;
  user_size: number | null;
  user_weight: number | null;
  user_last_weight: number | null;
  sport_program_id: number | null;
  company_id: number | null;
}

@Component({
  selector: 'app-admin-user-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-user-detail.component.html',
  styleUrl: './admin-user-detail.component.css',
})
export class AdminUserDetailComponent implements OnInit {
  loading = true;
  saving = false;
  deleting = false;
  loadingAllergies = false;
  loadingBiometrics = false;
  loadingConsumes = false;
  loadError = false;
  userId = '';
  sportProgramName = '';
  sportPrograms: Array<{ sport_program_id: number; sport_program_name: string }> = [];
  userAllergies: string[] = [];
  userBiometrics: any[] = [];
  userConsumes: any[] = [];
  selectedAllergies: string[] = [];
  newBiometricDate = '';
  newBiometricSleep: number | null = null;
  newBiometricSteps: number | null = null;
  newBiometricWeight: number | null = null;

  readonly allergiesList = ['gluten', 'crustaceans', 'eggs', 'fish', 'peanuts', 'soybeans', 'milk', 'nuts', 'celery', 'mustard', 'sesame', 'sulphites', 'lupin', 'molluscs'];

  readonly roleOptions = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' },
    { value: 'company_admin', label: 'Company admin' },
  ];

  readonly genderOptions = [
    { value: 'male', label: 'Homme' },
    { value: 'female', label: 'Femme' },
    { value: 'other', label: 'Autre' },
    { value: 'prefer_not_to_say', label: 'Prefere ne pas dire' },
  ];

  user: AdminUserForm = {
    user_username: '',
    user_lastname: '',
    user_firstname: '',
    user_email: '',
    user_phone: '',
    user_birth: '',
    user_role: 'user',
    user_gender: 'other',
    user_city: '',
    user_country: '',
    user_size: null,
    user_weight: null,
    user_last_weight: null,
    sport_program_id: null,
    company_id: null,
  };

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: ApiService,
    private readonly snack: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id') ?? '';
    if (!this.userId) {
      this.loadError = true;
      this.loading = false;
      return;
    }

    this.api.getUser(this.userId).subscribe({
      next: (data) => {
        this.user = {
          user_username: data?.user_username ?? '',
          user_lastname: data?.user_lastname ?? '',
          user_firstname: data?.user_firstname ?? '',
          user_email: data?.user_email ?? '',
          user_phone: data?.user_phone ?? '',
          user_birth: data?.user_birth ?? '',
          user_role: data?.user_role ?? 'user',
          user_gender: data?.user_gender ?? 'other',
          user_city: data?.user_city ?? '',
          user_country: data?.user_country ?? '',
          user_size: data?.user_size ?? null,
          user_weight: data?.user_weight ?? null,
          user_last_weight: data?.user_last_weight ?? null,
          sport_program_id: data?.sport_program_id ?? null,
          company_id: data?.company_id ?? null,
        };
        this.loadError = false;
        this.loading = false;
      },
      error: () => {
        this.loadError = true;
        this.loading = false;
        this.snack.open('Erreur API: utilisateur introuvable.', '', { duration: 3500 });
      },
    });

    this.api.getPrograms().subscribe({
      next: (programs) => {
        this.sportPrograms = programs ?? [];
        const selected = this.sportPrograms.find(p => p.sport_program_id === this.user.sport_program_id);
        if (selected) {
          this.sportProgramName = selected.sport_program_name;
        }
      },
      error: () => {
        this.sportPrograms = [];
      },
    });

    this.loadUserAllergies();
    this.loadUserBiometrics();
    this.loadUserConsumes();
  }

  private loadUserAllergies(): void {
    this.loadingAllergies = true;
    this.api.getUserAllergies(this.userId).subscribe({
      next: (allergies) => {
        this.userAllergies = allergies ?? [];
        this.selectedAllergies = [...this.userAllergies];
        this.loadingAllergies = false;
      },
      error: () => {
        this.userAllergies = [];
        this.loadingAllergies = false;
      },
    });
  }

  private loadUserBiometrics(): void {
    this.loadingBiometrics = true;
    this.api.getUserBiometrics(this.userId).subscribe({
      next: (biometrics) => {
        this.userBiometrics = (biometrics ?? []).sort((a, b) => 
          new Date(b.biometric_date).getTime() - new Date(a.biometric_date).getTime()
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
    this.loadingConsumes = true;
    this.api.getUserConsumes(this.userId).subscribe({
      next: (consumes) => {
        this.userConsumes = (consumes ?? []).sort((a, b) => 
          new Date(b.consume_date).getTime() - new Date(a.consume_date).getTime()
        ).slice(0, 20);
        this.loadingConsumes = false;
      },
      error: () => {
        this.userConsumes = [];
        this.loadingConsumes = false;
      },
    });
  }

  onProgramChange() {
    const selected = this.sportPrograms.find(p => p.sport_program_id === this.user.sport_program_id);
    this.sportProgramName = selected?.sport_program_name ?? '';
  }

  saveAllergies(): void {
    this.api.setUserAllergies(this.userId, this.selectedAllergies).subscribe({
      next: () => {
        this.userAllergies = [...this.selectedAllergies];
        this.snack.open('Allergies mises à jour.', '', { duration: 2500 });
      },
      error: () => {
        this.snack.open('Erreur lors de la mise à jour des allergies.', '', { duration: 3000 });
      },
    });
  }

  addBiometric(): void {
    if (!this.newBiometricDate) {
      this.snack.open('Veuillez choisir une date.', '', { duration: 2500 });
      return;
    }

    const data = {
      user_id: this.userId,
      biometric_date: this.newBiometricDate,
      biometric_sleep: this.newBiometricSleep,
      biometric_steps: this.newBiometricSteps,
      biometric_weight: this.newBiometricWeight,
    };

    this.api.createUserBiometric(data).subscribe({
      next: () => {
        this.newBiometricDate = '';
        this.newBiometricSleep = null;
        this.newBiometricSteps = null;
        this.newBiometricWeight = null;
        this.loadUserBiometrics();
        this.snack.open('Donnée biométrique ajoutée.', '', { duration: 2500 });
      },
      error: () => {
        this.snack.open('Erreur lors de l\'ajout.', '', { duration: 3000 });
      },
    });
  }

  deleteBiometric(id: number): void {
    if (!confirm('Supprimer cette entrée biométrique ?')) return;
    this.api.deleteUserBiometric(id).subscribe({
      next: () => {
        this.loadUserBiometrics();
        this.snack.open('Entrée biométrique supprimée.', '', { duration: 2500 });
      },
      error: () => {
        this.snack.open('Erreur lors de la suppression.', '', { duration: 3000 });
      },
    });
  }

  deleteConsume(id: number): void {
    if (!confirm('Supprimer cette consommation ?')) return;
    this.api.deleteConsume(id).subscribe({
      next: () => {
        this.loadUserConsumes();
        this.snack.open('Consommation supprimée.', '', { duration: 2500 });
      },
      error: () => {
        this.snack.open('Erreur lors de la suppression.', '', { duration: 3000 });
      },
    });
  }

  toggleAllergy(allergy: string): void {
    const index = this.selectedAllergies.indexOf(allergy);
    if (index > -1) {
      this.selectedAllergies.splice(index, 1);
    } else {
      this.selectedAllergies.push(allergy);
    }
  }

  isAllergySelected(allergy: string): boolean {
    return this.selectedAllergies.includes(allergy);
  }

  save(): void {
    if (!this.userId || this.saving) {
      return;
    }

    this.saving = true;

    const payload = {
      user_username: this.user.user_username,
      user_lastname: this.user.user_lastname,
      user_firstname: this.user.user_firstname,
      user_email: this.user.user_email,
      user_phone: this.user.user_phone,
      user_birth: this.user.user_birth,
      user_role: this.user.user_role,
      user_gender: this.user.user_gender,
      user_city: this.user.user_city || null,
      user_country: this.user.user_country || null,
      user_size: this.user.user_size,
      user_weight: this.user.user_weight,
      user_last_weight: this.user.user_last_weight,
      sport_program_id: this.user.sport_program_id,
      company_id: this.user.company_id,
    };

    this.api.updateUser(this.userId, payload).subscribe({
      next: () => {
        this.saving = false;
        this.snack.open('Utilisateur mis à jour avec succès.', '', { duration: 2500 });
      },
      error: () => {
        this.saving = false;
        this.snack.open('Erreur lors de la sauvegarde utilisateur.', '', { duration: 3500 });
      },
    });
  }

  deleteUser(): void {
    if (!this.userId || this.deleting) {
      return;
    }

    const confirmed = window.confirm(
      'Confirmer la suppression de ce compte utilisateur ? Cette action est irreversible.',
    );

    if (!confirmed) {
      return;
    }

    this.deleting = true;

    this.api.deleteUser(this.userId).subscribe({
      next: () => {
        this.deleting = false;
        this.snack.open('Compte utilisateur supprime.', '', { duration: 2500 });
        this.router.navigate(['/admin/user-list']);
      },
      error: () => {
        this.deleting = false;
        this.snack.open('Erreur lors de la suppression du compte.', '', { duration: 3500 });
      },
    });
  }
}
