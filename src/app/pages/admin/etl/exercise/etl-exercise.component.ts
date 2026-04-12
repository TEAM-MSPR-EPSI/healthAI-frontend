import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { EtlExerciseService } from './etl-exercise.service';

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
  isLoading = false;

  constructor(private router: Router, private etlExerciseService: EtlExerciseService) {}

  lancerExtractionExercise() {
    this.isLoading = true;
    this.showLogs = true;
    this.addLog('Lancement de l\'extraction...');

    this.etlExerciseService.extractExercises().subscribe({
      next: (result) => {
        result.detailed_logs.forEach((line: string) => this.addLog(line));
        this.isLoading = false;
      },
      error: (err) => {
        this.addLog('Erreur : ' + err.message);
        this.isLoading = false;
      }
    });
  }

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
