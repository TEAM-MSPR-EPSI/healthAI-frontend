import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-manage-biometrics',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './manage-biometrics.component.html',
  styleUrls: ['./manage-biometrics.component.css'],
})
export class ManageBiometricsComponent implements OnInit {
  userId: string | null = null;
  users: any[] = [];
  biometrics: any[] = [];
  loading = true;
  editing: Record<number, boolean> = {};
  // new biometric form
  newBiometricDate = '';
  newBiometricWeight: number | null = null;
  newBiometricSleep: number | null = null;
  newBiometricSteps: number | null = null;

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    const user = this.auth.currentUser();
    this.userId = user?.user_id ?? null;
    if (user?.user_role === 'company_admin' || user?.user_role === 'admin') {
      this.api.getUsers().subscribe({ next: (u) => (this.users = u ?? []) });
    }
    this.loadBiometrics();
  }

  loadBiometrics(): void {
    if (!this.userId) return;
    this.loading = true;
    this.api.getUserBiometrics(this.userId).subscribe({
      next: (b) => { this.biometrics = b ?? []; this.loading = false; },
      error: () => { this.biometrics = []; this.loading = false; },
    });
  }

  onUserChange(selectedId: string | null): void {
    this.userId = selectedId;
    if (!this.userId) {
      this.biometrics = [];
      return;
    }
    this.loadBiometrics();
  }

  startEdit(id: number): void { this.editing[id] = true; }
  cancelEdit(id: number): void { this.editing[id] = false; this.loadBiometrics(); }

  saveEdit(item: any): void {
    const payload = {
      biometric_date: item.biometric_date,
      biometric_weight: item.biometric_weight,
      biometric_sleep: item.biometric_sleep,
      biometric_steps: item.biometric_steps,
    };
    this.api.updateUserBiometric(item.biometric_id, payload).subscribe({
      next: () => { this.editing[item.biometric_id] = false; this.loadBiometrics(); },
      error: () => { this.editing[item.biometric_id] = false; this.loadBiometrics(); },
    });
  }

  createBiometric(): void {
    if (!this.userId || !this.newBiometricDate) return;
    const payload = {
      user_id: this.userId,
      biometric_date: this.newBiometricDate,
      biometric_weight: this.newBiometricWeight,
      biometric_sleep: this.newBiometricSleep,
      biometric_steps: this.newBiometricSteps,
    };
    this.api.createUserBiometric(payload).subscribe({ next: () => { this.clearNewBiometric(); this.loadBiometrics(); }, error: () => { this.clearNewBiometric(); this.loadBiometrics(); } });
  }

  deleteBiometric(id: number): void {
    this.api.deleteUserBiometric(id).subscribe({ next: () => { this.loadBiometrics(); }, error: () => { this.loadBiometrics(); } });
  }

  private clearNewBiometric(): void {
    this.newBiometricDate = new Date().toISOString().slice(0,10);
    this.newBiometricWeight = null;
    this.newBiometricSleep = null;
    this.newBiometricSteps = null;
  }
}
