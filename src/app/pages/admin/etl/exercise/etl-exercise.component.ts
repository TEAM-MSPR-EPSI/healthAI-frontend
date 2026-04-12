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
    if (this.vueActive === 'valid') {
      this.vueActive = null;
      return;
    }
    this.etlExerciseService.getExerciseData().subscribe({
      next: (result) => {
        this.exerciseValid = result.csv.exercise_valid?.data ?? [];
        this.exerciseInvalid = result.csv.exercise_invalid?.data ?? [];
        this.currentIndexValidExercise = 0;
        this.vueActive = 'valid';
      },
      error: (err) => this.addLog('Erreur : ' + err.message)
    });
  }

  chargerInvalideExercise() {
    if (this.vueActive === 'invalid') {
      this.vueActive = null;
      return;
    }
    this.etlExerciseService.getExerciseData().subscribe({
      next: (result) => {
        this.exerciseValid = result.csv.exercise_valid?.data ?? [];
        this.exerciseInvalid = result.csv.exercise_invalid?.data ?? [];
        this.currentIndexInvalidExercise = 0;
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
    const index = liste === 'valid' ? this.currentIndexValidExercise : this.currentIndexInvalidExercise;
    const exercise = source[index];

    const data = [{
      ...exercise,
      sport_exercise_instruction: exercise.sport_exercise_instruction ?? null,
    }];

    this.etlExerciseService.saveExerciseData(data).subscribe({
      next: (result) => {
        this.showLogs = true;
        this.addLog('✅ ' + result.message);
        this.etlExerciseService.getExerciseData().subscribe({
          next: (r) => {
            this.exerciseValid = r.csv.exercise_valid?.data ?? [];
            this.exerciseInvalid = r.csv.exercise_invalid?.data ?? [];
            this.currentIndexValidExercise = 0;
            this.currentIndexInvalidExercise = 0;
          }
        });
      },
      error: (err) => {
        this.showLogs = true;
        this.addLog('❌ Erreur : ' + JSON.stringify(err.error));
      }
    });
  }

  goToIndexValid(value: number) {
  if (!value) return;

  let index = value - 1;

  if (index < 0) index = 0;
  if (index >= this.exerciseValid.length) {
    index = this.exerciseValid.length - 1;
  }

  this.currentIndexValidExercise = index;
  }

  goToIndexInvalid(value: number) {
  if (!value) return;

  let index = value - 1;

  if (index < 0) index = 0;
  if (index >= this.exerciseInvalid.length) {
    index = this.exerciseInvalid.length - 1;
  }

  this.currentIndexInvalidExercise = index;
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
