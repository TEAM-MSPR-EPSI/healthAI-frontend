import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-biometrics',
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSnackBarModule,
    NgChartsModule,
  ],
  templateUrl: './biometrics.component.html',
  styleUrl: './biometrics.component.css',
})
export class BiometricsComponent implements OnInit {
  isLoading = true;
  isSaving = false;

  // ── Stats résumé ──────────────────────────────────────────
  currentStats = { sleep: '-- h --min', steps: 0, weight: 0 };

  // ── Formulaire saisie du jour ─────────────────────────────
  today = new Date().toISOString().slice(0, 10);
  todayWeight: number | null = null;
  todaySleep: number | null = null;
  todaySteps: number | null = null;
  /** id de l'entrée du jour si elle existe déjà en BDD */
  protected todayEntryId: number | null = null;

  // ── Historiques ──────────────────────────────────────────
  sleepHistory: { day: string; hours: number }[] = [];
  stepsHistory: { day: string; steps: number }[] = [];
  weightHistory: { week: string; weight: number | null }[] = [];

  // ── Charts ───────────────────────────────────────────────
  sleepChartType: ChartType = 'bar';
  stepsChartType: ChartType = 'bar';
  weightChartType: ChartType = 'line';
  sleepChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  stepsChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  weightChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadAll();
  }

  // ── Chargement ────────────────────────────────────────────
  private loadAll(): void {
    this.isLoading = true;
    this.api.getMyBiometricsSummary().subscribe({
      next: (payload: any) => {
        this.applyPayload(payload);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; },
    });
  }

  private applyPayload(payload: any): void {
    if (!payload) return;
    const { latest, last7Days, last6Weeks } = payload;

    if (latest) {
      this.currentStats.weight = latest.biometric_weight || 0;
      this.currentStats.steps  = latest.biometric_steps  || 0;
      const mins = latest.biometric_sleep || 0;
      this.currentStats.sleep = `${Math.floor(mins / 60)}h ${String(mins % 60).padStart(2, '0')}min`;

      // Pré-remplir le formulaire si la dernière entrée est aujourd'hui
      if (latest.biometric_date === this.today) {
        this.todayEntryId  = latest.biometric_id   ?? null;
        this.todayWeight   = latest.biometric_weight ?? null;
        this.todaySleep    = latest.biometric_sleep  ?? null;
        this.todaySteps    = latest.biometric_steps  ?? null;
      }
    }

    this.sleepHistory  = (last7Days || []).map((d: any) => ({ day: this.dayLabel(d.date), hours: (d.sleep || 0) / 60 }));
    this.stepsHistory  = (last7Days || []).map((d: any) => ({ day: this.dayLabel(d.date), steps: d.steps || 0 }));
    this.weightHistory = (last6Weeks || []).map((w: any, i: number) => ({ week: `Sem ${i + 1}`, weight: w.averageWeight }));
    this.updateCharts();
  }

  // ── Sauvegarde du jour ───────────────────────────────────
  async saveToday(): Promise<void> {
    if (this.isSaving) return;
    const user = this.auth.currentUser();
    if (!user?.user_id) {
      this.snackBar.open('Vous devez être connecté', 'OK', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    const payload = {
      user_id:          Number(user.user_id),
      biometric_date:   this.today,
      biometric_weight: this.todayWeight,
      biometric_sleep:  this.todaySleep,
      biometric_steps:  this.todaySteps,
    };

    try {
      if (this.todayEntryId !== null) {
        await firstValueFrom(this.api.updateUserBiometric(this.todayEntryId, payload));
      } else {
        const created = await firstValueFrom(this.api.createUserBiometric(payload));
        this.todayEntryId = created?.biometric_id ?? null;
      }
      this.snackBar.open('Données du jour enregistrées ✓', 'OK', { duration: 2500 });
      this.loadAll();
    } catch {
      this.snackBar.open('Erreur lors de la sauvegarde', 'OK', { duration: 3000 });
    } finally {
      this.isSaving = false;
    }
  }

  // ── Charts ────────────────────────────────────────────────
  private updateCharts(): void {
    this.sleepChartData = {
      labels: this.sleepHistory.map(e => e.day),
      datasets: [{
        label: 'Heures de sommeil',
        data: this.sleepHistory.map(e => +e.hours.toFixed(1)),
        backgroundColor: 'rgba(124, 109, 199, 0.72)',
        borderRadius: 8,
      }],
    };
    this.stepsChartData = {
      labels: this.stepsHistory.map(e => e.day),
      datasets: [{
        label: 'Pas',
        data: this.stepsHistory.map(e => e.steps),
        backgroundColor: 'rgba(67, 160, 71, 0.72)',
        borderRadius: 8,
      }],
    };
    this.weightChartData = {
      labels: this.weightHistory.map(e => e.week),
      datasets: [{
        label: 'Poids (kg)',
        data: this.weightHistory.map(e => e.weight),
        borderColor: 'rgba(249, 168, 37, 1)',
        backgroundColor: 'rgba(249, 168, 37, 0.15)',
        fill: true,
        tension: 0.32,
        pointRadius: 4,
      }],
    };
  }

  private dayLabel(dateString: string): string {
    if (!dateString) return '';
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    return days[new Date(dateString).getDay()];
  }
}
