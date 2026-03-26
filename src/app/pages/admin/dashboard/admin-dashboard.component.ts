// Component: AdminDashboard | Purpose: Renders and manages UI behavior for this view.
import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface AdminDashboardCard {
  title: string;
  description: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NgFor, RouterLink, MatCardModule, MatIconModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css',
})
export class AdminDashboardComponent {
  protected readonly importantSections: AdminDashboardCard[] = [
    {
      title: 'Dashboard Admin',
      description: 'Vue d\'ensemble de l\'administration et accès rapide aux sections clés.',
      icon: 'dashboard',
      route: '/admin',
    },
    {
      title: 'Liste des Utilisateurs',
      description: 'Consultez et suivez les comptes utilisateurs de la plateforme.',
      icon: 'manage_accounts',
      route: '/admin/user-list',
    },
    {
      title: 'Métriques Utilisateurs',
      description: 'Analysez les données de progression et d\'engagement utilisateur.',
      icon: 'people',
      route: '/admin/user-metrics',
    },
    {
      title: 'Analyses Nutritionnelles',
      description: 'Suivez les tendances nutritionnelles et la qualité des données alimentaires.',
      icon: 'restaurant',
      route: '/admin/nutrition',
    },
    {
      title: 'Statistiques Fitness',
      description: 'Visualisez les performances sportives et les indicateurs d\'activité.',
      icon: 'fitness_center',
      route: '/admin/fitness',
    },
    {
      title: 'KPIs Business',
      description: 'Pilotez les indicateurs stratégiques et la performance globale.',
      icon: 'bar_chart',
      route: '/admin/kpi',
    },
    {
      title: 'Validation des données',
      description: 'Contrôlez la cohérence des données avant publication.',
      icon: 'checklist',
      route: '/admin/data-check',
    },
    {
      title: 'Gestion des données',
      description: 'Administrez les référentiels et les contenus métier.',
      icon: 'edit_note',
      route: '/admin/manage',
    },
  ];
}
