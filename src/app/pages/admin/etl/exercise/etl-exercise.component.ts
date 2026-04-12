import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { EtlExerciseService } from './etl-exercise.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'etl-exercise',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, CommonModule, FormsModule],
  templateUrl: './etl-exercise.component.html',
  styleUrls: ['./etl-exercise.component.css'],
})

export class EtlExerciseComponent {
  showLogs = false;
  logs: string[] = [];
  isLoading = false;
  vueActive: 'valid' | 'invalid' | null = null;
  currentIndexValidExercise = 0;
  currentIndexInvalidExercise = 0;

  exerciseValid: any[] = [];
  exerciseInvalid: any[] = [];

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

  chargerValideExercise() {
    this.etlExerciseService.getExerciseData().subscribe({
      next: (result) => {
        this.exerciseValid = result.csv.exercise_valid?.data ?? [];
        this.exerciseInvalid = result.csv.exercise_invalid?.data ?? [];
        this.vueActive = 'valid'; 
      },
      error: (err) => this.addLog('Erreur : ' + err.message)
    });
  }

  chargerInvalideExercise() {
    this.etlExerciseService.getExerciseData().subscribe({
      next: (result) => {
        this.exerciseValid = result.csv.exercise_valid?.data ?? [];
        this.exerciseInvalid = result.csv.exercise_invalid?.data ?? [];
        this.vueActive = 'invalid'; 
      },
      error: (err) => this.addLog('Erreur : ' + err.message)
    });
  }

  get currentExerciseValid() {
    return this.exerciseValid[this.currentIndexValidExercise];
  }

  get currentExerciseInvalid() {
    return this.exerciseInvalid[this.currentIndexInvalidExercise];
  }

  precedentValid() {
    if (this.currentIndexValidExercise > 0) this.currentIndexValidExercise--;
  }

  suivantValid() {
    if (this.currentIndexValidExercise < this.exerciseValid.length - 1) this.currentIndexValidExercise++;
  }

  precedentInvalid() {
    if (this.currentIndexInvalidExercise > 0) this.currentIndexInvalidExercise--;
  }

  suivantInvalid() {
    if (this.currentIndexInvalidExercise < this.exerciseInvalid.length - 1) this.currentIndexInvalidExercise++;
  }

  sauvegarderExercise(liste: 'valid' | 'invalid') {
  const source = liste === 'valid' ? this.exerciseValid : this.exerciseInvalid;

  const data = source.map(exercise => ({
    ...exercise,
    sport_exercise_instruction: exercise.sport_exercise_instruction ?? null,
  }));

  this.etlExerciseService.saveExerciseData(data).subscribe({
    next: (result) => {
      this.showLogs = true;
      this.addLog('✅ ' + result.message);
    },
    error: (err) => {
      this.showLogs = true;
      this.addLog('❌ Erreur : ' + JSON.stringify(err.error));
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
