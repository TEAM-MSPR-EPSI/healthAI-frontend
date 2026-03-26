// Component: Biometrics | Purpose: Renders and manages UI behavior for this view.
import { Component } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-biometrics',
  standalone: true,
  imports: [DecimalPipe, MatCardModule, MatIconModule, RouterLink, NgChartsModule],
  templateUrl: './biometrics.component.html',
  styleUrl: './biometrics.component.css',
})
export class BiometricsComponent {
  currentStats = {
    sleep: '7h 32min',
    steps: 8542,
    weight: 74.2,
  };

  sleepHistory = [
    { day: 'Lun', hours: 7.5 },
    { day: 'Mar', hours: 6.8 },
    { day: 'Mer', hours: 8.1 },
    { day: 'Jeu', hours: 7.2 },
    { day: 'Ven', hours: 6.5 },
    { day: 'Sam', hours: 9.0 },
    { day: 'Dim', hours: 8.4 },
  ];

  stepsHistory = [
    { day: 'Lun', steps: 10230 },
    { day: 'Mar', steps: 7845 },
    { day: 'Mer', steps: 9120 },
    { day: 'Jeu', steps: 6500 },
    { day: 'Ven', steps: 11340 },
    { day: 'Sam', steps: 4200 },
    { day: 'Dim', steps: 8542 },
  ];

  weightHistory = [
    { week: 'Sem 1', weight: 76.0 },
    { week: 'Sem 2', weight: 75.5 },
    { week: 'Sem 3', weight: 75.1 },
    { week: 'Sem 4', weight: 74.8 },
    { week: 'Sem 5', weight: 74.5 },
    { week: 'Sem 6', weight: 74.2 },
  ];

  sleepChartType: ChartType = 'bar';
  stepsChartType: ChartType = 'bar';
  weightChartType: ChartType = 'line';

  sleepChartData: ChartConfiguration<'bar'>['data'] = {
    labels: this.sleepHistory.map((entry) => entry.day),
    datasets: [
      {
        label: 'Heures de sommeil',
        data: this.sleepHistory.map((entry) => entry.hours),
        backgroundColor: 'rgba(124, 109, 199, 0.72)',
        borderRadius: 8,
      },
    ],
  };

  stepsChartData: ChartConfiguration<'bar'>['data'] = {
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

  weightChartData: ChartConfiguration<'line'>['data'] = {
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
