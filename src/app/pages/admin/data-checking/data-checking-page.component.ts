import { Component } from '@angular/core';
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
  validationSteps = [
    {
      title: 'Profils utilisateurs',
      description: 'Vérification de la cohérence des données démographiques (âge, poids, taille)',
      status: 'En attente',
      icon: 'person',
    },
    {
      title: 'Base nutritionnelle',
      description: 'Contrôle des valeurs nutritionnelles (calories, macronutriments)',
      status: 'En attente',
      icon: 'restaurant_menu',
    },
    {
      title: 'Catalogue exercices',
      description: 'Validation des types, niveaux et équipements',
      status: 'En attente',
      icon: 'fitness_center',
    },
    {
      title: 'Métriques biométriques',
      description: 'Contrôle des données simulées (poids, sommeil, fréquence cardiaque)',
      status: 'En attente',
      icon: 'monitor_heart',
    },
  ];
}
