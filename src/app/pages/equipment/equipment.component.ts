// Component: Equipment | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-equipment',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatChipsModule, RouterLink],
  templateUrl: './equipment.component.html',
  styleUrl: './equipment.component.css',
})
export class EquipmentComponent implements OnInit {
  equipment: any[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getEquipment().subscribe({
      next: (data) => {
        this.equipment = data.map((e: any) => ({
          name: e.equipment_name,
          category: 'Matériel',
          weight: '-',
          available: true,
          emoji: '🏋️',
          description: e.equipment_name,
        }));
        this.loading = false;
      },
      error: () => { this.loading = false; },
    });
  }
}
