// Component: RecipesGrid | Purpose: Displays recipe cards loaded from the API in a responsive grid.
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-recipes-grid',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatChipsModule],
  templateUrl: './recipes-grid.component.html',
  styleUrl: './recipes-grid.component.css',
})
export class RecipesGridComponent {
  @Input() recipes: any[] = [];
  @Input() loading = true;
}
