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

  constructor(
    private router: Router,
    private etlNutritionService: EtlNutritionService,
  ) {}

  lancerExtractionNutrition() {
    this.isLoading = true;
    this.showLogs = true;
    this.addLog("Lancement de l'extraction...");

    this.etlNutritionService.extractIngredients().subscribe({
      next: (result) => {
        result.detailed_logs.forEach((line: string) => this.addLog(line));
        this.isLoading = false;
      },
      error: (err) => {
        this.addLog('Erreur : ' + err.message);
        this.isLoading = false;
      },
    });
  }

  chargerValideIngredient() {
    if (this.vueActive === 'valid') {
      this.vueActive = null;
      return;
    }
    this.etlNutritionService.getIngredientData().subscribe({
      next: (result) => {
        this.ingredientValid = result.csv.ingredient_valid?.data ?? [];
        this.ingredientInvalid = result.csv.ingredient_invalid?.data ?? [];
        this.currentIndexValidIngredient = 0;
        this.vueActive = 'valid';
      },
      error: (err) => this.addLog('Erreur : ' + err.message),
    });
  }

  chargerInvalideIngredient() {
    if (this.vueActive === 'invalid') {
      this.vueActive = null;
      return;
    }
    this.etlNutritionService.getIngredientData().subscribe({
      next: (result) => {
        this.ingredientValid = result.csv.ingredient_valid?.data ?? [];
        this.ingredientInvalid = result.csv.ingredient_invalid?.data ?? [];
        this.currentIndexInvalidIngredient = 0;
        this.vueActive = 'invalid';
      },
      error: (err) => this.addLog('Erreur : ' + err.message),
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
    if (this.currentIndexValidIngredient < this.ingredientValid.length - 1)
      this.currentIndexValidIngredient++;
  }

  precedentInvalid() {
    if (this.currentIndexInvalidIngredient > 0) this.currentIndexInvalidIngredient--;
  }

  suivantInvalid() {
    if (this.currentIndexInvalidIngredient < this.ingredientInvalid.length - 1)
      this.currentIndexInvalidIngredient++;
  }

  sauvegarderIngredient(liste: 'valid' | 'invalid') {
    const source = liste === 'valid' ? this.ingredientValid : this.ingredientInvalid;
    const index =
      liste === 'valid' ? this.currentIndexValidIngredient : this.currentIndexInvalidIngredient;
    const ingredient = source[index];

    const numericFields = [
      'ingredient_energy_100g',
      'ingredient_protein_100g',
      'ingredient_carbohydrate_100g',
      'ingredient_fats_100g',
      'ingredient_fiber_100g',
      'ingredient_sugars_100g',
      'ingredient_salt_100g',
      'ingredient_saturated_fats_100g',
    ];

    const parsed: any = { ...ingredient };
    for (const field of numericFields) {
      const v = ingredient[field];
      parsed[field] = v !== '' && v != null ? parseFloat(v) : null;
    }

    this.etlNutritionService.saveIngredientData([parsed]).subscribe({
      next: (result) => {
        this.showLogs = true;
        this.addLog('✅ ' + result.message);
        this.etlNutritionService.getIngredientData().subscribe({
          next: (r) => {
            this.ingredientValid = r.csv.ingredient_valid?.data ?? [];
            this.ingredientInvalid = r.csv.ingredient_invalid?.data ?? [];
            this.currentIndexValidIngredient = 0;
            this.currentIndexInvalidIngredient = 0;
          },
        });
      },
      error: (err) => {
        this.showLogs = true;
        this.addLog('❌ Erreur : ' + JSON.stringify(err.error));
      },
    });
  }

  goToIndexValid(value: number) {
    const index = value - 1;
    if (index >= 0 && index < this.ingredientValid.length) {
      this.currentIndexValidIngredient = index;
    }
  }

  goToIndexInvalid(value: number) {
    const index = value - 1;
    if (index >= 0 && index < this.ingredientInvalid.length) {
      this.currentIndexInvalidIngredient = index;
    }
  }

  chargerEnBddIngredient() {
    this.isLoading = true;
    this.showLogs = true;
    this.addLog('Chargement en base de données...');

    this.etlNutritionService.loadIngredientsToDb().subscribe({
      next: (result) => {
        result.detailed_logs.forEach((line: string) => this.addLog(line));
        this.addLog('✅ ' + result.message);
        this.isLoading = false;
      },
      error: (err) => {
        this.addLog('❌ Erreur : ' + JSON.stringify(err.error));
        this.isLoading = false;
      },
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
