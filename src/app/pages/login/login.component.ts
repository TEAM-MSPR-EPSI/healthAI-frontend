// Component: Login | Purpose: Renders and manages UI behavior for this view.
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  hide = true;
  errorMessage = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    this.errorMessage = '';
    if (!this.email || !this.password) {
      this.errorMessage = 'Veuillez remplir tous les champs.';
      return;
    }
    this.loading = true;
    try {
      await this.auth.login(this.email, this.password);
      this.router.navigate(['/recipes']);
    } catch {
      this.errorMessage = 'Email ou mot de passe incorrect.';
    } finally {
      this.loading = false;
    }
  }
}
