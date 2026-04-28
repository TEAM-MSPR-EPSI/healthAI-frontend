// Component: AdminUsersList | Purpose: Displays user profiles in an admin table with edit entry points.
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-admin-users-list',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './admin-users-list.component.html',
  styleUrl: './admin-users-list.component.css',
})
export class AdminUsersListComponent implements OnInit {
  loading = true;
  users: any[] = [];
  apiError = false;

  constructor(private api: ApiService, private snack: MatSnackBar) {}

  ngOnInit(): void {
    this.api.getUsers().subscribe({
      next: (data) => {
        this.users = Array.isArray(data) ? data : [];
        this.apiError = false;
        this.loading = false;
      },
      error: () => {
        this.users = [];
        this.apiError = true;
        this.loading = false;
        this.snack.open('Erreur API users: impossible de charger la liste.', '', { duration: 3500 });
      },
    });
  }

  trackById(_: number, row: any): number {
    return Number(row?.user_id ?? 0);
  }
}
