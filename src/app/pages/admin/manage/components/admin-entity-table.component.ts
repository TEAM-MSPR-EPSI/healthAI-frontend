// Component: AdminEntityTable | Purpose: Renders and edits a generic admin data table for the selected entity.
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ColumnConfig } from '../admin-manage.config';

@Component({
  selector: 'app-admin-entity-table',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './admin-entity-table.component.html',
  styleUrl: './admin-entity-table.component.css',
})
export class AdminEntityTableComponent {
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

  isEditable(colKey: string): boolean {
    return !colKey.endsWith('_id');
  }

  isEditingRow(row: any): boolean {
    return this.editingEntity === this.entity && this.editingId === row[this.idKey];
  }
}
