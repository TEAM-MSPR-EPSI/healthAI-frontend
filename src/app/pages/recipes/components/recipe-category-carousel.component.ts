// Component: RecipeCategoryCarousel | Purpose: Displays recipe categories as horizontally scrollable mini-cards.
import { Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

interface CategoryRecipe {
  name: string;
  time: string;
  image: string;
}

interface RecipeCategory {
  title: string;
  recipes: CategoryRecipe[];
}

@Component({
  selector: 'app-recipe-category-carousel',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './recipe-category-carousel.component.html',
  styleUrl: './recipe-category-carousel.component.css',
})
export class RecipeCategoryCarouselComponent {
  @Input() categories: RecipeCategory[] = [];
}
