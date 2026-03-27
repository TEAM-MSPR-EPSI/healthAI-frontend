import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-user-detail.component.html',
  styleUrl: './admin-user-detail.component.css',
})
export class AdminUserDetailComponent implements OnInit {
  loading = true;
  saving = false;
  loadError = false;
  userId = '';

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
}
