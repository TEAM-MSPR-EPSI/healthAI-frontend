import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'etl-exercise',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, CommonModule],
  templateUrl: './etl-exercise.component.html',
  styleUrls: ['./etl-exercise.component.css'],
})
export class EtlExerciseComponent {
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
