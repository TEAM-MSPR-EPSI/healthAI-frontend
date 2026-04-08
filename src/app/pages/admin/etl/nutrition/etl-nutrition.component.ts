import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'etl-nutrition',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './etl-nutrition.component.html',
  styleUrls: ['./etl-nutrition.component.css'],
})
export class EtlNutritionComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/admin/data-check']);
  }
}
