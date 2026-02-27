import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.css',
})
export class IngredientsComponent {
  ingredients = [
    { name: 'Poulet (blanc)', calories: 165, proteins: 31, carbs: 0, fats: 3.6, category: 'Protéines', emoji: '🍗' },
    { name: 'Saumon', calories: 208, proteins: 20, carbs: 0, fats: 13, category: 'Protéines', emoji: '🐟' },
    { name: 'Riz complet', calories: 111, proteins: 2.6, carbs: 23, fats: 0.9, category: 'Féculents', emoji: '🍚' },
    { name: 'Avocat', calories: 160, proteins: 2, carbs: 8.5, fats: 14.7, category: 'Lipides', emoji: '🥑' },
    { name: 'Brocoli', calories: 34, proteins: 2.8, carbs: 7, fats: 0.4, category: 'Légumes', emoji: '🥦' },
    { name: 'Œuf entier', calories: 155, proteins: 13, carbs: 1.1, fats: 11, category: 'Protéines', emoji: '🥚' },
    { name: 'Patate douce', calories: 86, proteins: 1.6, carbs: 20, fats: 0.1, category: 'Féculents', emoji: '🍠' },
    { name: 'Épinards', calories: 23, proteins: 2.9, carbs: 3.6, fats: 0.4, category: 'Légumes', emoji: '🥬' },
    { name: 'Amandes', calories: 579, proteins: 21, carbs: 22, fats: 49, category: 'Oléagineux', emoji: '🌰' },
    { name: 'Tofu', calories: 76, proteins: 8, carbs: 1.9, fats: 4.8, category: 'Protéines', emoji: '🧈' },
    { name: 'Quinoa', calories: 120, proteins: 4.4, carbs: 21, fats: 1.9, category: 'Féculents', emoji: '🌾' },
    { name: 'Banane', calories: 89, proteins: 1.1, carbs: 23, fats: 0.3, category: 'Fruits', emoji: '🍌' },
    { name: 'Yaourt grec', calories: 59, proteins: 10, carbs: 3.6, fats: 0.7, category: 'Laitiers', emoji: '🥛' },
    { name: 'Huile d\'olive', calories: 884, proteins: 0, carbs: 0, fats: 100, category: 'Lipides', emoji: '🫒' },
    { name: 'Lentilles', calories: 116, proteins: 9, carbs: 20, fats: 0.4, category: 'Légumineuses', emoji: '🫘' },
    { name: 'Tomate', calories: 18, proteins: 0.9, carbs: 3.9, fats: 0.2, category: 'Légumes', emoji: '🍅' },
  ];
}
