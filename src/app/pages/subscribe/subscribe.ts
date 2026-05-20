import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';

export interface SubscriptionPlan {
  id: number;
  name: string;
  features: string[];
  price: number;
  popular: boolean;
}

@Component({
  selector: 'app-subscribe',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
  ],
  templateUrl: './subscribe.html',
  styleUrl: './subscribe.css',
})
export class Subscribe implements OnInit {
  loading = false;

  // Données statiques par défaut — à remplacer par un appel API si disponible
  plans: SubscriptionPlan[] = [
    {
      id: 1,
      name: 'Nom abonnement',
      features: ['Avantage 1', 'Avantage 2'],
      price: 0,
      popular: false,
    },
    {
      id: 2,
      name: 'Nom abonnement',
      features: ['Avantage 1', 'Avantage 2', 'Avantage 3'],
      price: 0,
      popular: true,
    },
    {
      id: 3,
      name: 'Nom abonnement',
      features: ['Avantage 1', 'Avantage 2', 'Avantage 3', 'Avantage 4'],
      price: 0,
      popular: false,
    },
  ];

  constructor(
    private snackBar: MatSnackBar,
    // private api: ApiService, // décommente si tu charges les plans depuis l'API
  ) {}

  ngOnInit(): void {
    // this.loadPlans(); // décommente pour charger depuis l'API
  }

  // private loadPlans(): void {
  //   this.loading = true;
  //   this.api.getSubscriptionPlans().subscribe({
  //     next: (plans) => {
  //       this.plans = plans ?? [];
  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.plans = [];
  //       this.loading = false;
  //     },
  //   });
  // }

  selectPlan(plan: SubscriptionPlan): void {
    this.snackBar.open(`Abonnement "${plan.name}" sélectionné`, 'OK', { duration: 2500 });
    // TODO: naviguer vers le paiement ou appeler l'API d'abonnement
  }

  onImgError(event: Event): void {
    // Si l'image ne charge pas, on cache l'élément (le fond gris reste visible)
    (event.target as HTMLImageElement).classList.add('hidden');
  }
}