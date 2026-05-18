import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-manage-ingredients',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatInputModule],
  templateUrl: './manage-ingredients.component.html',
  styleUrls: ['./manage-ingredients.component.css'],
})
export class ManageIngredientsComponent implements OnInit {
  ingredients: any[] = [];
  loading = true;
  editing: Record<number, boolean> = {};
  // new ingredient form
  newName = '';
  newEnergy: number | null = null;
  newProtein: number | null = null;
  newCarbs: number | null = null;
  newFats: number | null = null;
  newType = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void { this.loadIngredients(); }

  loadIngredients(): void {
    this.loading = true;
    this.api.getIngredients().subscribe({ next: (list) => { this.ingredients = list || []; this.loading = false; }, error: () => { this.ingredients = []; this.loading = false; } });
  }

  startEdit(id: number): void { this.editing[id] = true; }
  cancelEdit(id: number): void { this.editing[id] = false; this.loadIngredients(); }

  saveEdit(item: any): void {
    const payload = {
      ingredient_name: item.ingredient_name,
      ingredient_energy_100g: item.ingredient_energy_100g,
      ingredient_protein_100g: item.ingredient_protein_100g,
      ingredient_carbohydrate_100g: item.ingredient_carbohydrate_100g,
      ingredient_fats_100g: item.ingredient_fats_100g,
      ingredient_type: item.ingredient_type,
    };
    this.api.updateIngredient(item.ingredient_id, payload).subscribe({ next: () => { this.editing[item.ingredient_id] = false; this.loadIngredients(); }, error: () => { this.editing[item.ingredient_id] = false; this.loadIngredients(); } });
  }

  createNew(): void {
    const payload = {
      ingredient_name: this.newName,
      ingredient_energy_100g: this.newEnergy,
      ingredient_protein_100g: this.newProtein,
      ingredient_carbohydrate_100g: this.newCarbs,
      ingredient_fats_100g: this.newFats,
      ingredient_type: this.newType,
    };
    this.api.createIngredient(payload).subscribe({ next: () => { this.clearNewForm(); this.loadIngredients(); }, error: () => { this.clearNewForm(); this.loadIngredients(); } });
  }

  deleteItem(id: number): void {
    this.api.deleteIngredient(id).subscribe({ next: () => { this.loadIngredients(); }, error: () => { this.loadIngredients(); } });
  }

  private clearNewForm(): void {
    this.newName = '';
    this.newEnergy = null;
    this.newProtein = null;
    this.newCarbs = null;
    this.newFats = null;
    this.newType = '';
  }
}
