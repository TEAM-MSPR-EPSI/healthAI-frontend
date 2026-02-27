import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './exercises.component.html',
  styleUrl: './exercises.component.css',
})
export class ExercisesComponent {
  exercises = [
    { name: 'Squat', muscle: 'Jambes', equipment: 'Barre', difficulty: 'Intermédiaire', icon: '🦵', description: 'Flexion des jambes avec charge sur les épaules.' },
    { name: 'Développé couché', muscle: 'Pectoraux', equipment: 'Banc + Barre', difficulty: 'Intermédiaire', icon: '💪', description: 'Poussée horizontale en position allongée.' },
    { name: 'Soulevé de terre', muscle: 'Dos / Jambes', equipment: 'Barre', difficulty: 'Avancé', icon: '🏋️', description: 'Levée de charge depuis le sol, travail complet du corps.' },
    { name: 'Tractions', muscle: 'Dos', equipment: 'Barre de traction', difficulty: 'Intermédiaire', icon: '🧗', description: 'Traction du corps vers le haut à la barre fixe.' },
    { name: 'Pompes', muscle: 'Pectoraux', equipment: 'Aucun', difficulty: 'Débutant', icon: '🤸', description: 'Poussée du corps depuis le sol, bras tendus.' },
    { name: 'Fentes', muscle: 'Jambes', equipment: 'Haltères', difficulty: 'Débutant', icon: '🚶', description: 'Pas en avant avec flexion du genou.' },
    { name: 'Curl biceps', muscle: 'Biceps', equipment: 'Haltères', difficulty: 'Débutant', icon: '💪', description: 'Flexion de l\'avant-bras avec charge.' },
    { name: 'Planche', muscle: 'Abdominaux', equipment: 'Aucun', difficulty: 'Débutant', icon: '🧘', description: 'Gainage statique en position de pompe.' },
    { name: 'Rowing barre', muscle: 'Dos', equipment: 'Barre', difficulty: 'Intermédiaire', icon: '🏋️', description: 'Tirage horizontal de la barre vers le buste.' },
    { name: 'Presse à cuisses', muscle: 'Jambes', equipment: 'Machine', difficulty: 'Débutant', icon: '🦵', description: 'Poussée des jambes sur machine guidée.' },
    { name: 'Dips', muscle: 'Triceps / Pectoraux', equipment: 'Barres parallèles', difficulty: 'Intermédiaire', icon: '🤸', description: 'Descente et poussée du corps entre deux barres.' },
    { name: 'Crunchs', muscle: 'Abdominaux', equipment: 'Aucun', difficulty: 'Débutant', icon: '🧘', description: 'Contraction des abdominaux en position allongée.' },
  ];
}
