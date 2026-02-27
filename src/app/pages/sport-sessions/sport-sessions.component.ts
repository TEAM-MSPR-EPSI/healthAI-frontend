import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-sport-sessions',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './sport-sessions.component.html',
  styleUrl: './sport-sessions.component.css',
})
export class SportSessionsComponent {
  sessions = [
    {
      name: 'Upper Body Blast',
      program: 'Prise de Masse',
      duration: '45 min',
      exercises: 6,
      calories: 380,
      status: 'completed',
      date: '26/02/2026',
    },
    {
      name: 'Cardio HIIT #12',
      program: 'Perte de Poids Express',
      duration: '30 min',
      exercises: 8,
      calories: 450,
      status: 'completed',
      date: '25/02/2026',
    },
    {
      name: 'Leg Day',
      program: 'Prise de Masse',
      duration: '50 min',
      exercises: 7,
      calories: 420,
      status: 'planned',
      date: '27/02/2026',
    },
    {
      name: 'Core & Abs',
      program: 'Remise en Forme',
      duration: '25 min',
      exercises: 5,
      calories: 200,
      status: 'planned',
      date: '28/02/2026',
    },
    {
      name: 'Full Body Express',
      program: 'HIIT Total Body',
      duration: '35 min',
      exercises: 10,
      calories: 500,
      status: 'planned',
      date: '01/03/2026',
    },
    {
      name: 'Running 5km',
      program: 'Running Débutant',
      duration: '32 min',
      exercises: 1,
      calories: 320,
      status: 'completed',
      date: '24/02/2026',
    },
    {
      name: 'Yoga Flow',
      program: 'Yoga & Flexibilité',
      duration: '40 min',
      exercises: 12,
      calories: 150,
      status: 'completed',
      date: '23/02/2026',
    },
    {
      name: 'Push Pull',
      program: 'Prise de Masse',
      duration: '55 min',
      exercises: 8,
      calories: 460,
      status: 'planned',
      date: '02/03/2026',
    },
  ];
}
