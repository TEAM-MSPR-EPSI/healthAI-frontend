import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { firstValueFrom } from 'rxjs';

export interface SubscriptionPlan {
  id: number;          // subscription_id en BDD
  name: string;
  features: string[];
  price: number;
  popular: boolean;
}

// Map des features par plan (données UI statiques)
const PLAN_FEATURES: Record<string, string[]> = {
  Freemium: [
    'Journal alimentaire',
    'Suivi d\'activité',
    'Calcul d\'IMC',
    'Tableaux de progression simples',
  ],
  Premium: [
    'Recommandations personnalisées générées par IA',
    'Plans nutritionnels détaillés',
    'Plans sportifs détaillés',
    'Suivi avancé des objectifs',
  ],
  'Premium+': [
    'Intégration des données biométriques (FC, sommeil, poids)',
    'Connexion aux objets connectés',
    'Consultations en ligne avec des nutritionnistes partenaires',
  ],
};

const POPULAR_PLAN = 'Premium';

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
  loading = true;
  subscribing = false;

  plans: SubscriptionPlan[] = [];

  // Abonnement actif de l'utilisateur (null si aucun)
  activeSubscriptionId: number | null = null;
  activeSubscriptionName: string | null = null;

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private snackBar: MatSnackBar,
  ) {}

  async ngOnInit(): Promise<void> {
    await Promise.all([this.loadPlans(), this.loadActiveSubscription()]);
    this.loading = false;
  }

  private async loadPlans(): Promise<void> {
    try {
      const subs = await firstValueFrom(this.api.getSubscriptions());
      // On filtre B2B (plan entreprise, pas affiché aux users)
      this.plans = subs
        .filter((s: any) => s.subscription_name !== 'B2B')
        .map((s: any) => ({
          id: s.subscription_id,
          name: s.subscription_name,
          features: PLAN_FEATURES[s.subscription_name] ?? [],
          price: parseFloat(s.subscription_price),
          popular: s.subscription_name === POPULAR_PLAN,
        }));
    } catch {
      this.snackBar.open('Impossible de charger les abonnements', 'OK', { duration: 3000 });
    }
  }

  private async loadActiveSubscription(): Promise<void> {
    try {
      const active = await firstValueFrom(this.api.getActiveUserSubscription());
      this.activeSubscriptionId = active?.user_subscription_id ?? null;
      this.activeSubscriptionName = active?.subscription?.subscription_name ?? null;
    } catch {
      // 404 = pas d'abonnement actif, c'est normal
      this.activeSubscriptionId = null;
      this.activeSubscriptionName = null;
    }
  }

  isCurrentPlan(plan: SubscriptionPlan): boolean {
    return plan.name === this.activeSubscriptionName;
  }

  async selectPlan(plan: SubscriptionPlan): Promise<void> {
    if (this.subscribing || this.isCurrentPlan(plan)) return;

    const currentUser = this.auth.currentUser();
    const userId = currentUser?.user_id;

    if (!userId) {
      this.snackBar.open('Vous devez être connecté', 'OK', { duration: 3000 });
      return;
    }

    this.subscribing = true;

    try {
      // Si l'user a déjà un abonnement actif, on l'annule d'abord
      if (this.activeSubscriptionId !== null) {
        await firstValueFrom(this.api.cancelUserSubscription(this.activeSubscriptionId));
      }

      await firstValueFrom(
        this.api.createUserSubscription({
          user_id: Number(userId),
          subscription_id: plan.id,
          user_subscription_end: null,
        }),
      );

      this.activeSubscriptionId = null; // sera rechargé
      this.activeSubscriptionName = plan.name;

      this.snackBar.open(`Abonnement "${plan.name}" activé !`, 'OK', { duration: 3000 });
    } catch (err: any) {
      const msg =
        err?.status === 409
          ? 'Vous avez déjà un abonnement actif'
          : 'Une erreur est survenue, veuillez réessayer';
      this.snackBar.open(msg, 'OK', { duration: 3500 });
    } finally {
      this.subscribing = false;
    }
  }

  onImgError(event: Event): void {
    (event.target as HTMLImageElement).classList.add('hidden');
  }
}