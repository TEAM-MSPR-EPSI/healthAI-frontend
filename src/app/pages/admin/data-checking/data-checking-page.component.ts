import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../../services/api.service';

interface ValidationStep {
  title: string;
  description: string;
  icon: string;
  route: string | null;
}

interface MenuItem {
  label: string;
  icon: string;
  target: string;
}

@Component({
  selector: 'data-checking-page',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  templateUrl: './data-checking-page.component.html',
  styleUrls: ['./data-checking-page.component.css'],
})
export class DataCheckingPageComponent {
  isUploading = false;
  uploadSuccess = '';
  uploadError = '';
  selectedFileName = '';
  selectedFile: File | null = null;

  submenuItems: MenuItem[] = [
    { label: 'Contrôles', icon: 'checklist', target: 'validation-section' },
    { label: 'Import SQL', icon: 'upload_file', target: 'sql-import-section' },
    { label: 'Aide', icon: 'help_outline', target: 'help-section' },
  ];

  validationSteps: ValidationStep[] = [
    {
      title: 'Base nutritionnelle',
      description: 'Contrôle des valeurs nutritionnelles (calories, macronutriments)',
      icon: 'restaurant_menu',
      route: '/admin/etl/nutrition',
    },
    {
      title: 'Catalogue exercices',
      description: 'Validation des types, niveaux et équipements',
      icon: 'fitness_center',
      route: '/admin/etl/exercise',
    }
  ];

  constructor(private router: Router, private api: ApiService) {}

  launchValidation(route: string | null) {
    if (route) {
      this.router.navigate([route]);
    }
  }

  scrollToSection(target: string): void {
    const element = document.getElementById(target);
    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    this.selectedFile = file;
    this.selectedFileName = file?.name ?? '';
    this.uploadError = '';
    this.uploadSuccess = '';
  }

  uploadSqlFile(): void {
    if (!this.selectedFile) {
      this.uploadError = "Sélectionnez un fichier SQL avant de lancer l'import.";
      return;
    }

    if (!this.selectedFile.name.toLowerCase().endsWith('.sql')) {
      this.uploadError = "Le fichier doit être au format .sql.";
      return;
    }

    this.isUploading = true;
    this.uploadError = '';
    this.uploadSuccess = '';

    this.api
      .importSqlFile(this.selectedFile)
      .pipe(finalize(() => (this.isUploading = false)))
      .subscribe({
        next: (response) => {
          this.uploadSuccess = response?.message ?? "Import envoyé avec succès. Le traitement a été déclenché.";
          this.selectedFile = null;
          this.selectedFileName = '';
        },
        error: (error) => {
          this.uploadError = error?.error?.error ?? error?.error?.message ?? "L'import a échoué. Vérifiez le fichier SQL et réessayez.";
        },
      });
  }
}
