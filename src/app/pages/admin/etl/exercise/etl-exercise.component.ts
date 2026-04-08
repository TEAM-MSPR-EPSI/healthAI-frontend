import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'etl-exercise',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './etl-exercise.component.html',
  styleUrls: ['./etl-exercise.component.css'],
})
export class EtlExerciseComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/admin/data-check']);
  }
}
