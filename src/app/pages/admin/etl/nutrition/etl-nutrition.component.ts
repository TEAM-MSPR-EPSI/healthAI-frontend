import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'etl-nutrition',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, CommonModule],
  templateUrl: './etl-nutrition.component.html',
  styleUrls: ['./etl-nutrition.component.css'],
})
export class EtlNutritionComponent {
  showLogs = false;
  logs: string[] = [];

  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/admin/data-check']);
  }

  toggleLogs() {
    this.showLogs = !this.showLogs;
  }

  clearLogs() {
    this.logs = [];
  }

  addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push(`[${timestamp}] ${message}`);
  }
}
