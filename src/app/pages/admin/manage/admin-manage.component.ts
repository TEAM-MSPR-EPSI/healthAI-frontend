// Component: AdminManage | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';
import {
  ADMIN_MANAGE_COLUMNS,
  ADMIN_MANAGE_ID_KEYS,
  ADMIN_MANAGE_TABS,
  ColumnConfig,
  TabConfig,
} from './admin-manage.config';
import { AdminEntityTableComponent } from './components/admin-entity-table.component';
import { RelationEditorComponent } from './components/relation-editor.component';

@Component({
  selector: 'app-admin-manage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    AdminEntityTableComponent,
    RelationEditorComponent,
  ],
  templateUrl: './admin-manage.component.html',
  styleUrl: './admin-manage.component.css',
})
export class AdminManageComponent implements OnInit {
  tabs: TabConfig[] = ADMIN_MANAGE_TABS;
  isLoading = true;
  apiErrorMessage = '';
  activeTab = 'recipes';

  recipes: any[] = [];
  ingredients: any[] = [];
  programs: any[] = [];
  sessions: any[] = [];
  exercises: any[] = [];
  equipment: any[] = [];

  editingId: number | null = null;
  editingEntity = '';
  editBuffer: any = {};

  showRelationEditor = false;
  selectedRelationEntity = '';
  selectedRelationColumn: ColumnConfig | null = null;
  selectedRelationParent: any = null;

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.isLoading = true;
    this.apiErrorMessage = '';

    let remaining = 6;
    let failures = 0;

    const onDone = () => {
      remaining -= 1;
      if (remaining <= 0) {
        this.isLoading = false;
        if (failures === 6) {
          this.apiErrorMessage = 'Impossible de charger les données. Vérifiez que l\'API backend est démarrée et saine.';
        }
      }
    };

    const onError = () => {
      failures += 1;
      onDone();
    };

    this.api.getRecipes().subscribe({ next: (d) => { this.recipes = d; onDone(); }, error: onError });
    this.api.getFood().subscribe({ next: (d) => { this.ingredients = d; onDone(); }, error: onError });
    this.api.getPrograms().subscribe({ next: (d) => { this.programs = d; onDone(); }, error: onError });
    this.api.getSessions().subscribe({ next: (d) => { this.sessions = d; onDone(); }, error: onError });
    this.api.getExercises().subscribe({ next: (d) => { this.exercises = d; onDone(); }, error: onError });
    this.api.getEquipment().subscribe({ next: (d) => { this.equipment = d; onDone(); }, error: onError });
  }

  selectTab(key: string) {
    this.activeTab = key;
    this.cancelEdit();
  }

  getColumns(tab: string): ColumnConfig[] {
    return ADMIN_MANAGE_COLUMNS[tab] ?? [];
  }

  getIdKey(tab: string): string {
    return ADMIN_MANAGE_ID_KEYS[tab] ?? 'id';
  }

  getData(tab: string): any[] {
    return (this as any)[tab] ?? [];
  }

  startEdit(entity: string, row: any) {
    this.editingEntity = entity;
    this.editingId = row[this.getIdKey(entity)];
    this.editBuffer = { ...row };
  }

  cancelEdit() {
    this.editingId = null;
    this.editingEntity = '';
    this.editBuffer = {};
  }

  saveEdit() {
    if (!this.editingId || !this.editingEntity) return;
    this.api.updateItem(this.editingEntity, this.editingId, this.editBuffer).subscribe({
      next: () => {
        this.snack.open('Sauvegardé', '', { duration: 2000 });
        this.loadAll();
        this.cancelEdit();
      },
      error: () => this.snack.open('Erreur lors de la sauvegarde', '', { duration: 3000 }),
    });
  }

  deleteRow(entity: string, row: any) {
    const id = row[this.getIdKey(entity)];
    if (!id) return;
    this.api.deleteItem(entity, id).subscribe({
      next: () => {
        this.snack.open('Supprimé', '', { duration: 2000 });
        this.loadAll();
      },
      error: () => this.snack.open('Erreur lors de la suppression', '', { duration: 3000 }),
    });
  }

  onViewRelations(data: { row: any; column: ColumnConfig }) {
    this.selectedRelationParent = data.row;
    this.selectedRelationColumn = data.column;
    this.selectedRelationEntity = this.activeTab;
    this.showRelationEditor = true;
  }

  closeRelationEditor() {
    this.showRelationEditor = false;
    this.selectedRelationParent = null;
    this.selectedRelationColumn = null;
    this.selectedRelationEntity = '';
  }

  onRelationUpdated() {
    this.loadAll();
    this.closeRelationEditor();
  }
}
