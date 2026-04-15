// Component: DataCheckingPage | Purpose: Renders and manages UI behavior for this view.
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'data-checking-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './data-checking-page.component.html',
  styleUrls: ['./data-checking-page.component.css'],
})
export class DataCheckingPageComponent {
  constructor(private router: Router) {}

  validationSteps = [
    {
      title: 'Base nutritionnelle',
      description: 'Contrôle des valeurs nutritionnelles (calories, macronutriments)',
      status: 'En attente',
      icon: 'restaurant_menu',
      route: '/admin/etl/nutrition',
    },
    {
      title: 'Catalogue exercices',
      description: 'Validation des types, niveaux et équipements',
      status: 'En attente',
      icon: 'fitness_center',
      route: '/admin/etl/exercise',
    }
  ];

  launchValidation(route: string | null) {
    if (route) {
      this.router.navigate([route]);
    }
  }
}
