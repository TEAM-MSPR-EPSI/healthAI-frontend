// Component: Recipes | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../services/api.service';
import { RecipeCategoryCarouselComponent } from './components/recipe-category-carousel.component';
import { RecipesGridComponent } from './components/recipes-grid.component';

@Component({
  selector: 'app-recipes',
  standalone: true,
  imports: [RouterLink, MatIconModule, RecipeCategoryCarouselComponent, RecipesGridComponent],
  templateUrl: './recipes.component.html',
  styleUrl: './recipes.component.css',
})
export class RecipesComponent implements OnInit {
  categories = [
    {
      title: 'Petit Déjeuner',
      recipes: [
        { name: 'Porridge', time: '15 min', image: '🥣' },
        { name: 'Pancakes', time: '20 min', image: '🥞' },
        { name: 'Œufs brouillés', time: '35 min', image: '🔍' },
      ],
    },
    {
      title: 'Recettes pour vous',
      recipes: [
        { name: 'Salade César', time: '15 min', image: '🥗' },
        { name: 'Poulet grillé', time: '20 min', image: '🍗' },
        { name: 'Bowl légumes', time: '35 min', image: '🥙' },
      ],
    },
    {
      title: 'Dîner équilibré',
      recipes: [
        { name: 'Pasta légère', time: '25 min', image: '🍝' },
        { name: 'Saumon vapeur', time: '30 min', image: '🐟' },
        { name: 'Soupe miso', time: '20 min', image: '🍜' },
      ],
    },
  ];

  /** Recipes loaded from the API */
  dbRecipes: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getRecipes().subscribe({
      next: (data) => {
        this.dbRecipes = data;
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
