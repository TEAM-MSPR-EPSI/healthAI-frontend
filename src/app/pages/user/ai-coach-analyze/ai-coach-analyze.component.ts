import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';

interface FoodItem {
  name: string;
  confidence: number;
  portion_g: number;
  calories: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
}

interface AnalyzeResult {
  detected_foods: FoodItem[];
  total_calories: number;
  target_calories: number | null;
  total_protein_g: number;
  total_carbs_g: number;
  total_fat_g: number;
  imbalances: string[];
  suggestions: string[];
  macros_ratios: { proteins_pct: number; carbs_pct: number; fat_pct: number };
  ml_label: string | null;
  ml_confidence: number | null;
}

@Component({
  selector: 'app-ai-coach-analyze',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './ai-coach-analyze.component.html',
  styleUrl: './ai-coach-analyze.component.css',
})
export class AiCoachAnalyzeComponent {

  isLoading = false;
  errorMsg = '';
  result: AnalyzeResult | null = null;
  previewUrl: string | null = null;
  selectedFile: File | null = null;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedFile = file;
    this.result = null;
    this.errorMsg = '';

    const reader = new FileReader();
    reader.onload = () => { this.previewUrl = reader.result as string; };
    reader.readAsDataURL(file);
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    this.selectedFile = file;
    this.result = null;
    this.errorMsg = '';
    const reader = new FileReader();
    reader.onload = () => { this.previewUrl = reader.result as string; };
    reader.readAsDataURL(file);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  analyze(): void {
    if (!this.selectedFile) return;
    this.isLoading = true;
    this.errorMsg = '';
    this.result = null;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post<AnalyzeResult>('/nutrition/api/nutrition/analyze', formData).subscribe({
      next: (res) => {
        this.result = res;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = err?.error?.detail ?? 'Erreur lors de l\'analyse. Vérifie que le service nutrition est démarré.';
        this.isLoading = false;
      },
    });
  }

  reset(): void {
    this.result = null;
    this.previewUrl = null;
    this.selectedFile = null;
    this.errorMsg = '';
  }

  confidencePct(c: number): string {
    return (c * 100).toFixed(0) + '%';
  }
}
