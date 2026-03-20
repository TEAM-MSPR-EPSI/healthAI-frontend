// Component: RecipeDetail | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './recipe-detail.component.html',
  styleUrl: './recipe-detail.component.css',
})
export class RecipeDetailComponent implements OnInit {
  recipe: any = null;
  loading = true;
  isFavorite = false;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isFinite(id) && id > 0) {
      this.api.getRecipe(id).subscribe({
        next: (data) => {
          this.recipe = data;
          this.loading = false;
        },
        error: () => { this.loading = false; },
      });
    } else {
      this.loading = false;
    }
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite;
  }
}
