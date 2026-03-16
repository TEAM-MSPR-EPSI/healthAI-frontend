// Component: Ingredients | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-ingredients',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule, MatProgressSpinnerModule, RouterLink],
  templateUrl: './ingredients.component.html',
  styleUrl: './ingredients.component.css',
})
export class IngredientsComponent implements OnInit {
  ingredients: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getFood().subscribe({
      next: (data) => {
        this.ingredients = data.map((f: any) => ({
          name: f.food_name,
          calories: f.food_calories_per_100g,
          proteins: f.food_protein_per_100g,
          carbs: f.food_carbs_per_100g,
          fats: f.food_fat_per_100g,
          category: f.food_allergens ?? 'Aliment',
          emoji: '🥗',
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
