import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { ApiService } from '../../../../services/api.service';
import { ColumnConfig } from '../admin-manage.config';

type RelationMode = 'program-session' | 'recipe-ingredient' | 'session-exercise' | 'unknown';

@Component({
  selector: 'app-relation-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './relation-editor.component.html',
  styleUrl: './relation-editor.component.css',
})
export class RelationEditorComponent implements OnChanges {
  @Input() parentEntity = '';
  @Input() parentRow: any = null;
  @Input() relationColumn: ColumnConfig | null = null;

  @Output() close = new EventEmitter<void>();
  @Output() updated = new EventEmitter<void>();

  currentRelations: any[] = [];
  availableItems: any[] = [];

  selectedItemId: number | null = null;
  addRank = 1;
  addQuantity = 100;

  loading = false;

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['parentRow'] || changes['relationColumn'] || changes['parentEntity']) {
      this.refreshData();
    }
  }

  get mode(): RelationMode {
    if (this.parentEntity === 'programs' && this.relationColumn?.key === 'programSessions') {
      return 'program-session';
    }
    if (this.parentEntity === 'recipes' && this.relationColumn?.key === 'RecipeIngredients') {
      return 'recipe-ingredient';
    }
    if (this.parentEntity === 'sessions' && this.relationColumn?.key === 'sessionExercises') {
      return 'session-exercise';
    }
    return 'unknown';
  }

  get title(): string {
    if (this.mode === 'program-session') return 'Gérer les séances du programme';
    if (this.mode === 'recipe-ingredient') return 'Gérer les ingrédients de la recette';
    if (this.mode === 'session-exercise') return 'Gérer les exercices de la séance';
    return 'Gérer les relations';
  }

  refreshData(): void {
    this.currentRelations = this.extractCurrentRelations();
    this.currentRelations.forEach((rel) => {
      rel._editRank = this.getCurrentRank(rel);
      rel._editQuantity = this.getCurrentQuantity(rel);
    });

    this.selectedItemId = null;
    this.loading = true;

    this.loadAvailableItems().subscribe({
      next: (items) => {
        this.availableItems = items;
        this.loading = false;
      },
      error: () => {
        this.availableItems = [];
        this.loading = false;
      },
    });
  }

  addRelation(): void {
    const parentId = this.getParentId();
    const targetId = Number(this.selectedItemId);

    if (!parentId || !targetId) {
      return;
    }

    if (this.mode === 'program-session') {
      this.api.addSessionToProgram(parentId, targetId, Number(this.addRank) || 1).subscribe({
        next: () => this.afterMutation('Séance ajoutée au programme'),
        error: () => this.snack.open('Erreur lors de l\'ajout de la séance', '', { duration: 3000 }),
      });
      return;
    }

    if (this.mode === 'recipe-ingredient') {
      this.api.addIngredientToRecipe(parentId, targetId, Number(this.addQuantity) || 0).subscribe({
        next: () => this.afterMutation('Ingrédient ajouté à la recette'),
        error: () => this.snack.open('Erreur lors de l\'ajout de l\'ingrédient', '', { duration: 3000 }),
      });
      return;
    }

    if (this.mode === 'session-exercise') {
      this.api.addExerciseToSession(parentId, targetId, Number(this.addRank) || 1).subscribe({
        next: () => this.afterMutation('Exercice ajouté à la séance'),
        error: () => this.snack.open('Erreur lors de l\'ajout de l\'exercice', '', { duration: 3000 }),
      });
    }
  }

  removeRelation(relation: any): void {
    const parentId = this.getParentId();
    const targetId = this.getTargetId(relation);

    if (!parentId || !targetId) return;

    if (this.mode === 'program-session') {
      this.api.removeSessionFromProgram(parentId, targetId).subscribe({
        next: () => this.afterMutation('Séance retirée du programme'),
        error: () => this.snack.open('Erreur lors de la suppression', '', { duration: 3000 }),
      });
      return;
    }

    if (this.mode === 'recipe-ingredient') {
      this.api.removeIngredientFromRecipe(parentId, targetId).subscribe({
        next: () => this.afterMutation('Ingrédient retiré de la recette'),
        error: () => this.snack.open('Erreur lors de la suppression', '', { duration: 3000 }),
      });
      return;
    }

    if (this.mode === 'session-exercise') {
      this.api.removeExerciseFromSession(parentId, targetId).subscribe({
        next: () => this.afterMutation('Exercice retiré de la séance'),
        error: () => this.snack.open('Erreur lors de la suppression', '', { duration: 3000 }),
      });
    }
  }

  updateRelation(relation: any): void {
    const parentId = this.getParentId();
    const targetId = this.getTargetId(relation);

    if (!parentId || !targetId) return;

    if (this.mode === 'program-session') {
      const rank = Number(relation._editRank) || 1;
      this.api.updateSessionRank(parentId, targetId, rank).subscribe({
        next: () => this.afterMutation('Rang mis à jour'),
        error: () => this.snack.open('Erreur lors de la mise à jour', '', { duration: 3000 }),
      });
      return;
    }

    if (this.mode === 'recipe-ingredient') {
      const quantity = Number(relation._editQuantity) || 0;
      this.api.updateIngredientQuantity(parentId, targetId, quantity).subscribe({
        next: () => this.afterMutation('Quantité mise à jour'),
        error: () => this.snack.open('Erreur lors de la mise à jour', '', { duration: 3000 }),
      });
      return;
    }

    if (this.mode === 'session-exercise') {
      const rank = Number(relation._editRank) || 1;
      this.api.updateExerciseRankInSession(parentId, targetId, rank).subscribe({
        next: () => this.afterMutation('Rang mis à jour'),
        error: () => this.snack.open('Erreur lors de la mise à jour', '', { duration: 3000 }),
      });
    }
  }

  getDisplayName(item: any): string {
    return (
      item?.sport_session_name ||
      item?.ingredient_name ||
      item?.sport_exercise_name ||
      item?.name ||
      'Élément'
    );
  }

  private afterMutation(successMessage: string): void {
    this.snack.open(successMessage, '', { duration: 2000 });
    this.updated.emit();
  }

  private extractCurrentRelations(): any[] {
    const key = this.relationColumn?.key;
    if (!key || !this.parentRow) return [];
    const value = this.parentRow[key];
    return Array.isArray(value) ? [...value] : [];
  }

  private loadAvailableItems() {
    const parentId = this.getParentId();

    if (!parentId) {
      return of([]);
    }

    if (this.mode === 'program-session') {
      return this.api.getAvailableSessionsForProgram(parentId);
    }

    if (this.mode === 'recipe-ingredient') {
      return this.api.getAvailableIngredientsForRecipe(parentId);
    }

    if (this.mode === 'session-exercise') {
      return this.api.getAvailableExercisesForSession(parentId);
    }

    return of([]);
  }

  private getParentId(): number {
    if (!this.parentRow) return 0;
    if (this.parentEntity === 'programs') return Number(this.parentRow.sport_program_id) || 0;
    if (this.parentEntity === 'recipes') return Number(this.parentRow.recipe_id) || 0;
    if (this.parentEntity === 'sessions') return Number(this.parentRow.sport_session_id) || 0;
    return 0;
  }

  private getTargetId(relation: any): number {
    if (this.mode === 'program-session') {
      return Number(relation?.sport_session_id ?? relation?.sport_session?.sport_session_id) || 0;
    }
    if (this.mode === 'recipe-ingredient') {
      return Number(relation?.ingredient_id ?? relation?.ingredient?.ingredient_id) || 0;
    }
    if (this.mode === 'session-exercise') {
      return Number(relation?.sport_exercise_id ?? relation?.sportExercise?.sport_exercise_id) || 0;
    }
    return 0;
  }

  private getCurrentRank(relation: any): number {
    return Number(relation?.program_sport_session_rank ?? relation?.sport_session_exercise_rank ?? 1) || 1;
  }

  private getCurrentQuantity(relation: any): number {
    return Number(relation?.ingredient_quantity ?? 0) || 0;
  }
}
