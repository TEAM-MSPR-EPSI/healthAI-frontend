import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent {
  recipes = [
    {
      name: 'Salade César au Poulet',
      description: 'Salade croquante avec poulet grillé, parmesan et croûtons maison.',
      calories: 420,
      time: '20 min',
      difficulty: 'Facile',
      tags: ['Protéiné', 'Salade'],
      image: '🥗',
    },
    {
      name: 'Bowl Saumon Avocat',
      description: 'Bol de riz avec saumon frais, avocat, edamame et sauce soja.',
      calories: 580,
      time: '25 min',
      difficulty: 'Facile',
      tags: ['Oméga-3', 'Bowl'],
      image: '🍣',
    },
    {
      name: 'Pasta Bolognaise Légère',
      description: 'Pâtes complètes avec sauce bolognaise allégée à la dinde.',
      calories: 510,
      time: '35 min',
      difficulty: 'Moyen',
      tags: ['Pâtes', 'Protéiné'],
      image: '🍝',
    },
    {
      name: 'Smoothie Bowl Fruits Rouges',
      description: 'Smoothie épais aux fruits rouges, granola, chia et miel.',
      calories: 320,
      time: '10 min',
      difficulty: 'Facile',
      tags: ['Petit-déj', 'Vegan'],
      image: '🫐',
    },
    {
      name: 'Poulet Tikka Masala',
      description: 'Poulet mariné dans une sauce crémeuse aux épices indiennes.',
      calories: 620,
      time: '45 min',
      difficulty: 'Moyen',
      tags: ['Épicé', 'Protéiné'],
      image: '🍛',
    },
    {
      name: 'Wrap Végétarien',
      description: 'Tortilla garnie de houmous, légumes grillés et feta.',
      calories: 380,
      time: '15 min',
      difficulty: 'Facile',
      tags: ['Végétarien', 'Rapide'],
      image: '🌯',
    },
    {
      name: 'Soupe Miso au Tofu',
      description: 'Soupe japonaise légère avec tofu soyeux, algues et oignons verts.',
      calories: 180,
      time: '15 min',
      difficulty: 'Facile',
      tags: ['Vegan', 'Léger'],
      image: '🍜',
    },
    {
      name: 'Steak de Thon Grillé',
      description: 'Thon mi-cuit accompagné de légumes vapeur et sauce ponzu.',
      calories: 450,
      time: '20 min',
      difficulty: 'Moyen',
      tags: ['Poisson', 'Protéiné'],
      image: '🐟',
    },
  ];
}
