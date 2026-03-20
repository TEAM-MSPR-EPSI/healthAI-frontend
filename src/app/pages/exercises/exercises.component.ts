// Component: Exercises | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule, RouterLink],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.css',
})
export class ExercisesComponent implements OnInit {
  exercises: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getExercises().subscribe({
      next: (data) => {
        this.exercises = data.map((e: any) => ({
          name: e.exercise_name,
          muscle: e.exercise_target_muscles,
          description: e.exercise_instructions,
          equipment: e.equipment_id ?? 'Aucun',
          difficulty: e.exercise_difficulty,
          icon: '💪',
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
