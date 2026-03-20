// Component: Profile | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
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
  profile = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    birthDate: null as Date | null,
    gender: '',
    height: 0,
    goal: '',
  };

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
    const user = this.auth.currentUser();
    if (user) {
      this.userId = user.user_id;
      this.profile = {
        firstName: user.user_firstname ?? '',
        lastName: user.user_lastname ?? '',
        email: user.user_email ?? '',
        phone: user.user_phone ?? '',
        birthDate: user.user_birthdate ? new Date(user.user_birthdate) : null,
        gender: user.user_gender ?? '',
        height: user.user_height ?? 0,
        goal: '',
      };
    }
  }

  save() {
    if (!this.userId) return;
    const payload = {
      user_firstname: this.profile.firstName,
      user_lastname: this.profile.lastName,
      user_email: this.profile.email,
      user_phone: this.profile.phone,
      user_birthdate: this.profile.birthDate?.toISOString().split('T')[0],
      user_gender: this.profile.gender,
      user_height: this.profile.height,
    };
    this.api.updateUser(this.userId, payload).subscribe({
      next: () => this.snackBar.open('Profil sauvegardé', 'OK', { duration: 2500 }),
      error: () => this.snackBar.open('Erreur lors de la sauvegarde', 'OK', { duration: 3000 }),
    });
  }
}

