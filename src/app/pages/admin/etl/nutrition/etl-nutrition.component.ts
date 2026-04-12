import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EtlNutritionService } from './etl-nutrition.service';

@Component({
  selector: 'etl-nutrition',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, CommonModule, FormsModule],
  templateUrl: './etl-nutrition.component.html',
  styleUrls: ['./etl-nutrition.component.css'],
})

export class EtlNutritionComponent {
  showLogs = false;
  logs: string[] = [];
  isLoading = false;
  vueActive: 'valid' | 'invalid' | null = null;
  currentIndexValidIngredient = 0;
  currentIndexInvalidIngredient = 0;

  ingredientValid: any[] = [];
  ingredientInvalid: any[] = [];

  constructor(private router: Router, private etlNutritionService: EtlNutritionService) {}

  lancerExtractionNutrition() {
    this.isLoading = true;
    this.showLogs = true;
    this.addLog('Lancement de l\'extraction...');

    this.etlNutritionService.extractIngredients().subscribe({
      next: (result) => {
        result.detailed_logs.forEach((line: string) => this.addLog(line));
        this.isLoading = false;
      },
      error: (err) => {
        this.addLog('Erreur : ' + err.message);
        this.isLoading = false;
      }
    });
  }

  chargerValideIngredient() {
    this.etlNutritionService.getIngredientData().subscribe({
      next: (result) => {
        this.ingredientValid = result.csv.ingredient_valid?.data ?? [];
        this.ingredientInvalid = result.csv.ingredient_invalid?.data ?? [];
        this.currentIndexValidIngredient = 0;
        this.vueActive = 'valid';
      },
      error: (err) => this.addLog('Erreur : ' + err.message)
    });
  }

  chargerInvalideIngredient() {
    this.etlNutritionService.getIngredientData().subscribe({
      next: (result) => {
        this.ingredientValid = result.csv.ingredient_valid?.data ?? [];
        this.ingredientInvalid = result.csv.ingredient_invalid?.data ?? [];
        this.currentIndexInvalidIngredient = 0;
        this.vueActive = 'invalid';
      },
      error: (err) => this.addLog('Erreur : ' + err.message)
    });
  }

    get currentIngredientValid() {
    return this.ingredientValid[this.currentIndexValidIngredient];
  }

  get currentIngredientInvalid() {
    return this.ingredientInvalid[this.currentIndexInvalidIngredient];
  }

  precedentValid() {
    if (this.currentIndexValidIngredient > 0) this.currentIndexValidIngredient--;
  }

  suivantValid() {
    if (this.currentIndexValidIngredient < this.ingredientValid.length - 1) this.currentIndexValidIngredient++;
  }

  precedentInvalid() {
    if (this.currentIndexInvalidIngredient > 0) this.currentIndexInvalidIngredient--;
  }

  suivantInvalid() {
    if (this.currentIndexInvalidIngredient < this.ingredientInvalid.length - 1) this.currentIndexInvalidIngredient++;
  }

  sauvegarderIngredient(liste: 'valid' | 'invalid') {
    const source = liste === 'valid' ? this.ingredientValid : this.ingredientInvalid;
    
    const data = source.map(ingredient => ({
      ...ingredient,
      ingredient_energy_100g: ingredient.ingredient_energy_100g !== '' && ingredient.ingredient_energy_100g != null ? parseFloat(ingredient.ingredient_energy_100g) : null,
      ingredient_protein_100g: ingredient.ingredient_protein_100g !== '' && ingredient.ingredient_protein_100g != null ? parseFloat(ingredient.ingredient_protein_100g) : null,
      ingredient_carbohydrate_100g: ingredient.ingredient_carbohydrate_100g !== '' && ingredient.ingredient_carbohydrate_100g != null ? parseFloat(ingredient.ingredient_carbohydrate_100g) : null,
      ingredient_fats_100g: ingredient.ingredient_fats_100g !== '' && ingredient.ingredient_fats_100g != null ? parseFloat(ingredient.ingredient_fats_100g) : null,
      ingredient_fiber_100g: ingredient.ingredient_fiber_100g !== '' && ingredient.ingredient_fiber_100g != null ? parseFloat(ingredient.ingredient_fiber_100g) : null,
      ingredient_sugars_100g: ingredient.ingredient_sugars_100g !== '' && ingredient.ingredient_sugars_100g != null ? parseFloat(ingredient.ingredient_sugars_100g) : null,
      ingredient_salt_100g: ingredient.ingredient_salt_100g !== '' && ingredient.ingredient_salt_100g != null ? parseFloat(ingredient.ingredient_salt_100g) : null,
      ingredient_saturated_fats_100g: ingredient.ingredient_saturated_fats_100g !== '' && ingredient.ingredient_saturated_fats_100g != null ? parseFloat(ingredient.ingredient_saturated_fats_100g) : null,
    }));

    this.etlNutritionService.saveIngredientData(data).subscribe({
      next: (result) => {
        this.addLog('✅ ' + result.message);
      },
      error: (err) => {
        this.showLogs = true;
        this.addLog('❌ Erreur : ' + JSON.stringify(err.error));
      }
    });
  }

  goBack() {
    this.router.navigate(['/admin/data-check']);
  }

  toggleLogs() {
    this.showLogs = !this.showLogs;
  }

  clearLogs() {
    this.logs = [];
  }

  addLog(message: string) {
    const timestamp = new Date().toLocaleTimeString();
    this.logs.push(`[${timestamp}] ${message}`);
  }
}