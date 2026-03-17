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
  ],
  templateUrl: './admin-manage.component.html',
  styleUrl: './admin-manage.component.css',
})
export class AdminManageComponent implements OnInit {
  tabs: TabConfig[] = ADMIN_MANAGE_TABS;
  isLoading = true;
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

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.api.getRecipes().subscribe({ next: (d) => { this.recipes = d; this.checkLoadingDone(); }, error: () => { this.checkLoadingDone(); } });
    this.api.getFood().subscribe({ next: (d) => { this.ingredients = d; this.checkLoadingDone(); }, error: () => { this.checkLoadingDone(); } });
    this.api.getPrograms().subscribe({ next: (d) => { this.programs = d; this.checkLoadingDone(); }, error: () => { this.checkLoadingDone(); } });
    this.api.getSessions().subscribe({ next: (d) => { this.sessions = d; this.checkLoadingDone(); }, error: () => { this.checkLoadingDone(); } });
    this.api.getExercises().subscribe({ next: (d) => { this.exercises = d; this.checkLoadingDone(); }, error: () => { this.checkLoadingDone(); } });
    this.api.getEquipment().subscribe({ next: (d) => { this.equipment = d; this.checkLoadingDone(); }, error: () => { this.checkLoadingDone(); } });
  }

  checkLoadingDone() {
    setTimeout(() => { this.isLoading = false; }, 300);
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
}
