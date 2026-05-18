import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink],
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
  showPasswordRules = false;

  passwordCriteria = {
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
    hasMinLength: false,
    passwordsMatch: false
  };

  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  validatePassword() {
    const pwd = this.password;
    this.passwordCriteria = {
      hasUppercase: /[A-Z]/.test(pwd),
      hasLowercase: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd),
      hasMinLength: pwd.length >= 8,
      passwordsMatch: pwd === this.confirmPassword
    };
  }

  getPasswordStrength(): number {
    const criteria = Object.values(this.passwordCriteria);
    return (criteria.filter(c => c).length / criteria.length) * 100;
  }

  isPasswordValid(): boolean {
    return Object.values(this.passwordCriteria).every(c => c);
  }

  async register() {
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
    try {
      await this.auth.register(this.email, this.password);
      this.router.navigate(['/onboarding/role']);
    } catch (err: any) {
      const serverMessage = err?.error?.error || err?.message;
      this.errorMessage = serverMessage || 'Erreur lors de la création du compte.';
    } finally {
      this.loading = false;
    }
  }
}
