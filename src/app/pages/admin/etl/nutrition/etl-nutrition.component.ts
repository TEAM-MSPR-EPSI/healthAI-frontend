import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { EtlNutritionService} from './etl-nutrition.service';

@Component({
  selector: 'etl-nutrition',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatCardModule, CommonModule],
  templateUrl: './etl-nutrition.component.html',
  styleUrls: ['./etl-nutrition.component.css'],
})
export class EtlNutritionComponent {
  showLogs = false;
  logs: string[] = [];
  isLoading = false;


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
