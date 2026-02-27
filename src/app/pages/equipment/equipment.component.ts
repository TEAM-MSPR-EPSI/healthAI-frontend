import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.css',
})
export class EquipmentComponent {
  equipment = [
    { name: 'Barre olympique', category: 'Barres', weight: '20 kg', available: true, emoji: '🏋️', description: 'Barre standard de 220cm pour les exercices composés.' },
    { name: 'Haltères réglables', category: 'Haltères', weight: '2-32 kg', available: true, emoji: '🔩', description: 'Paire d\'haltères avec poids ajustables.' },
    { name: 'Banc de musculation', category: 'Bancs', weight: '-', available: true, emoji: '🪑', description: 'Banc inclinable multiposition pour développé couché et incliné.' },
    { name: 'Barre de traction', category: 'Barres', weight: '-', available: true, emoji: '🧗', description: 'Barre fixe murale pour tractions et suspensions.' },
    { name: 'Kettlebell 16kg', category: 'Poids libres', weight: '16 kg', available: true, emoji: '🔔', description: 'Kettlebell en fonte pour swings, snatches et squats.' },
    { name: 'Tapis de sol', category: 'Accessoires', weight: '-', available: true, emoji: '🧘', description: 'Tapis épais pour exercices au sol et yoga.' },
    { name: 'Corde à sauter', category: 'Cardio', weight: '-', available: true, emoji: '🪢', description: 'Corde de vitesse réglable pour échauffement et cardio.' },
    { name: 'Élastiques de résistance', category: 'Accessoires', weight: '5-40 kg', available: true, emoji: '🔗', description: 'Set de 5 bandes élastiques de résistance variable.' },
    { name: 'Vélo d\'appartement', category: 'Cardio', weight: '-', available: false, emoji: '🚲', description: 'Vélo stationnaire avec résistance magnétique.' },
    { name: 'Rameur', category: 'Cardio', weight: '-', available: true, emoji: '🚣', description: 'Rameur à résistance air/eau pour cardio complet.' },
    { name: 'Disques de fonte', category: 'Poids libres', weight: '1.25-25 kg', available: true, emoji: '⚫', description: 'Ensemble de disques olympiques calibrés.' },
    { name: 'Sac de frappe', category: 'Boxe', weight: '30 kg', available: false, emoji: '🥊', description: 'Sac lourd suspendu pour entraînement de boxe.' },
  ];
}
