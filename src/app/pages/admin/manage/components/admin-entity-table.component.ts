// Component: AdminEntityTable | Purpose: Renders and edits a generic admin data table for the selected entity.
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { ColumnConfig } from '../admin-manage.config';

@Component({
  selector: 'app-admin-entity-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
  ],
  templateUrl: './admin-entity-table.component.html',
  styleUrl: './admin-entity-table.component.css',
})
export class AdminEntityTableComponent {
  Array = Array; // Make Array available to template
  @Input() entity = '';
  @Input() columns: ColumnConfig[] = [];
  @Input() rows: any[] = [];
  @Input() idKey = 'id';
  @Input() editingId: number | null = null;
  @Input() editingEntity = '';
  @Input() editBuffer: any = {};

  @Output() startEditRow = new EventEmitter<any>();
  @Output() cancelEditRow = new EventEmitter<void>();
  @Output() saveEditRow = new EventEmitter<void>();
  @Output() deleteRowById = new EventEmitter<any>();
  @Output() viewRelations = new EventEmitter<{row: any, column: ColumnConfig}>();

  isEditable(column: ColumnConfig): boolean {
    return !column.key.endsWith('_id') && column.type !== 'relation';
  }

  isEditingRow(row: any): boolean {
    return this.editingEntity === this.entity && this.editingId === row[this.idKey];
  }

  getInputType(col: ColumnConfig): string {
    return col.type || 'text';
  }

  getDisplayValue(row: any, col: ColumnConfig): string {
    const val = row[col.key];
    // Convert boolean to human text
    if (col.type === 'boolean') {
      return val ? 'Oui' : 'Non';
    }
    return val !== null && val !== undefined ? String(val) : '';
  }
}
