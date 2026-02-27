import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-sport-programs',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatProgressBarModule],
  templateUrl: './sport-programs.component.html',
  styleUrl: './sport-programs.component.css',
})
export class SportProgramsComponent {
  programs = [
    {
      name: 'Perte de Poids Express',
      description: 'Programme intensif de 8 semaines combinant cardio et renforcement.',
      duration: '8 semaines',
      sessions: 24,
      level: 'Intermédiaire',
      progress: 65,
      icon: 'local_fire_department',
    },
    {
      name: 'Prise de Masse Musculaire',
      description: 'Programme progressif axé sur l\'hypertrophie avec charges croissantes.',
      duration: '12 semaines',
      sessions: 48,
      level: 'Avancé',
      progress: 30,
      icon: 'fitness_center',
    },
    {
      name: 'Remise en Forme Douce',
      description: 'Programme accessible pour reprendre le sport en douceur.',
      duration: '6 semaines',
      sessions: 18,
      level: 'Débutant',
      progress: 100,
      icon: 'self_improvement',
    },
    {
      name: 'Running Débutant',
      description: 'Passez de 0 à 5km en 8 semaines avec des séances progressives.',
      duration: '8 semaines',
      sessions: 24,
      level: 'Débutant',
      progress: 45,
      icon: 'directions_run',
    },
    {
      name: 'HIIT Total Body',
      description: 'Sessions courtes et intenses pour brûler un max de calories.',
      duration: '4 semaines',
      sessions: 16,
      level: 'Avancé',
      progress: 0,
      icon: 'bolt',
    },
    {
      name: 'Yoga & Flexibilité',
      description: 'Améliorez votre souplesse et réduisez le stress en 6 semaines.',
      duration: '6 semaines',
      sessions: 18,
      level: 'Débutant',
      progress: 80,
      icon: 'spa',
    },
  ];
}
