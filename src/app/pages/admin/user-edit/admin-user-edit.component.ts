// Component: AdminUserEdit | Purpose: Edits one user profile from admin route index.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-user-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
  ],
  templateUrl: './admin-user-edit.component.html',
  styleUrl: './admin-user-edit.component.css',
})
export class AdminUserEditComponent implements OnInit {
  loading = true;
  saving = false;
  userId: number | null = null;
  notFound = false;

  model: any = {
    user_id: null,
    user_username: '',
    user_lastname: '',
    user_firstname: '',
    user_role: 'user',
    user_gender: 'prefer_not_to_say',
    user_city: '',
    user_country: '',
    user_phone: '',
    user_size: null,
    user_weight: null,
    user_inscription: '',
    sport_program_id: null,
    company_id: null,
  };

  roleOptions = ['admin', 'user', 'company_admin'];
  genderOptions = ['male', 'female', 'other', 'prefer_not_to_say'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private snack: MatSnackBar,
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const parsed = Number(idParam);

    if (!idParam || Number.isNaN(parsed)) {
      this.notFound = true;
      this.loading = false;
      return;
    }

    this.userId = parsed;
    this.loadUser(parsed);
  }

  save(): void {
    if (!this.userId || this.saving) return;

    this.saving = true;

    const payload = {
      user_username: this.model.user_username,
      user_lastname: this.model.user_lastname,
      user_firstname: this.model.user_firstname,
      user_role: this.model.user_role,
      user_gender: this.model.user_gender,
      user_city: this.model.user_city,
      user_country: this.model.user_country,
      user_phone: this.model.user_phone,
      user_size: this.model.user_size,
      user_weight: this.model.user_weight,
      sport_program_id: this.model.sport_program_id,
      company_id: this.model.company_id,
    };

    this.api.updateUser(String(this.userId), payload).subscribe({
      next: () => {
        this.saving = false;
        this.snack.open('Utilisateur mis a jour', '', { duration: 2200 });
        this.router.navigate(['/admin/users']);
      },
      error: () => {
        this.saving = false;
        this.snack.open('Erreur API users: echec de mise a jour.', '', { duration: 3500 });
      },
    });
  }

  private loadUser(id: number): void {
    this.api.getUser(String(id)).subscribe({
      next: (user) => {
        if (!user) {
          this.notFound = true;
        } else {
          this.model = { ...this.model, ...user };
        }
        this.loading = false;
      },
      error: () => {
        this.notFound = true;
        this.loading = false;
      },
    });
  }
}
