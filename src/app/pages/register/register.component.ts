// Component: Register | Purpose: Renders and manages UI behavior for this view.
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email = '';
  password = '';
  confirmPassword = '';
  hide = true;
  hideConfirm = true;
  loading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
  ) {}

  register() {
    this.errorMessage = '';
    if (!this.email || !this.password || !this.confirmPassword) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas.';
      return;
    }
    this.loading = true;
    this.api.createUser({
      user_email: this.email,
      user_password: this.password,
    }).subscribe({
      next: () => {
        // Auto-login after registration
        this.auth.login(this.email, this.password).then(() => {
          this.router.navigate(['/onboarding/name']);
        }).catch(() => {
          this.router.navigate(['/login']);
        });
      },
      error: () => {
        this.errorMessage = 'Erreur lors de la création du compte.';
        this.loading = false;
      },
    });
  }
}
