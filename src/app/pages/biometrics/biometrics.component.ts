import { Component, OnInit } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-biometrics',
  standalone: true,
  imports: [DecimalPipe, MatCardModule, MatIconModule, RouterLink, NgChartsModule],
  templateUrl: './biometrics.component.html',
  styleUrl: './biometrics.component.css',
})
export class BiometricsComponent implements OnInit {
  currentStats = {
    sleep: '-- h --min',
    steps: 0,
    weight: 0,
  };

  sleepHistory: any[] = [];
  stepsHistory: any[] = [];
  weightHistory: any[] = [];

  sleepChartType: ChartType = 'bar';
  stepsChartType: ChartType = 'bar';
  weightChartType: ChartType = 'line';

  sleepChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  stepsChartData: ChartConfiguration<'bar'>['data'] = { labels: [], datasets: [] };
  weightChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };

  isLoading = true;

  constructor(private api: ApiService, private auth: AuthService) {}

  ngOnInit(): void {
    this.loadBiometricData();
  }

  private loadBiometricData(): void {
    this.api.getMyBiometricsSummary().subscribe({
      next: (payload: any) => {
        if (!payload) {
          this.isLoading = false;
          return;
        }

        // payload: { latest, last7Days, last6Weeks }
        const { latest, last7Days, last6Weeks } = payload;

        if (latest) {
          this.currentStats.weight = latest.biometric_weight || 0;
          this.currentStats.steps = latest.biometric_steps || 0;
          const sleepMinutes = latest.biometric_sleep || 0;
          const hours = Math.floor(sleepMinutes / 60);
          const minutes = sleepMinutes % 60;
          this.currentStats.sleep = `${hours}h ${String(minutes).padStart(2, '0')}min`;
        }

        this.sleepHistory = (last7Days || []).map((d: any) => ({ day: this.getDayLabelFromDate(d.date), hours: (d.sleep || 0) / 60 }));
        this.stepsHistory = (last7Days || []).map((d: any) => ({ day: this.getDayLabelFromDate(d.date), steps: d.steps || 0 }));

        this.weightHistory = (last6Weeks || []).map((w: any, idx: number) => ({ week: `Sem ${idx + 1}`, weight: w.averageWeight }));

        this.updateCharts();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading biometrics summary:', err);
        this.isLoading = false;
      },
    });
  }

  private getDayLabelFromDate(dateString: string): string {
    if (!dateString) return '';
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const d = new Date(dateString);
    return days[d.getDay()];
  }

  private updateCharts(): void {
    this.sleepChartData = {
      labels: this.sleepHistory.map((entry) => entry.day),
      datasets: [
        {
          label: 'Heures de sommeil',
          data: this.sleepHistory.map((entry) => Number(entry.hours.toFixed(1))),
          backgroundColor: 'rgba(124, 109, 199, 0.72)',
          borderRadius: 8,
        },
      ],
    };

    this.stepsChartData = {
      labels: this.stepsHistory.map((entry) => entry.day),
      datasets: [
        {
          label: 'Pas',
          data: this.stepsHistory.map((entry) => entry.steps),
          backgroundColor: 'rgba(67, 160, 71, 0.72)',
          borderRadius: 8,
        },
      ],
    };

    this.weightChartData = {
      labels: this.weightHistory.map((entry) => entry.week),
      datasets: [
        {
          label: 'Poids (kg)',
          data: this.weightHistory.map((entry) => entry.weight),
          borderColor: 'rgba(249, 168, 37, 1)',
          backgroundColor: 'rgba(249, 168, 37, 0.2)',
          fill: true,
          tension: 0.32,
          pointRadius: 4,
        },
      ],
    };
  }
}
