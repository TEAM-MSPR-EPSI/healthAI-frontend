import { Component, signal, computed } from '@angular/core';
import { Router, RouterOutlet, RouterLink, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SidebarComponent, MenuItem } from './shared/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    SidebarComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('HealthAI Coach');
  protected sidenavOpened = signal(true);
  protected isMobile = signal(false);
  protected showShell = signal(true);
  protected isAdmin = signal(false);

  /* Admin menu items */
  protected adminMenuItems: MenuItem[] = [
    { label: 'Dashboard Admin', icon: 'dashboard', route: '/admin' },
    { label: 'Métriques Utilisateurs', icon: 'people', route: '/admin/user-metrics' },
    { label: 'Analyses Nutritionnelles', icon: 'restaurant', route: '/admin/nutrition' },
    { label: 'Statistiques Fitness', icon: 'fitness_center', route: '/admin/fitness' },
    { label: 'KPIs Business', icon: 'bar_chart', route: '/admin/kpi' },
    { label: 'Validation des données', icon: 'checklist', route: '/admin/data-check' },
  ];

  /* User menu items */
  protected userMenuItems: MenuItem[] = [
    { label: 'Recettes', icon: 'restaurant_menu', route: '/recipes' },
    { label: 'Ingrédients', icon: 'egg', route: '/ingredients' },
    { label: 'Programmes Sportifs', icon: 'fitness_center', route: '/sport-programs' },
    { label: 'Séances de Sport', icon: 'directions_run', route: '/sport-sessions' },
    { label: 'Exercices', icon: 'sports_gymnastics', route: '/exercises' },
    { label: 'Matériel', icon: 'sports_kabaddi', route: '/equipment' },
    { label: 'Données Biométriques', icon: 'monitor_heart', route: '/biometrics' },
    { label: 'Mon Profil', icon: 'person', route: '/profile' },
  ];

  protected currentMenuItems = computed(() =>
    this.isAdmin() ? this.adminMenuItems : this.userMenuItems
  );

  protected toolbarTitle = computed(() =>
    this.isAdmin() ? 'Administration' : 'HealthAI Coach'
  );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile.set(result.matches);
      this.sidenavOpened.set(!result.matches);
    });

    // Hide toolbar/sidebar on auth, onboarding, splash & home pages
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects || e.url;
        const noShellRoutes = /^\/(login|register|welcome|onboarding|lost-account|home)?$/;
        const noShellPrefixes = /^\/(onboarding)\//;
        this.showShell.set(!noShellRoutes.test(url) && !noShellPrefixes.test(url));
        this.isAdmin.set(/^\/admin/.test(url));
      });
  }

  toggleSidenav() {
    this.sidenavOpened.set(!this.sidenavOpened());
  }
}
