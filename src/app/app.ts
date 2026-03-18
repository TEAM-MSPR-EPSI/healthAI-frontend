// Component: App | Purpose: Renders and manages UI behavior for this view.
import { Component, signal, computed } from '@angular/core';
import { Router, RouterOutlet, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { filter } from 'rxjs/operators';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { SidebarComponent, MenuItem } from './shared/sidebar/sidebar.component';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
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
    { label: 'Profils utilisateurs', icon: 'manage_accounts', route: '/admin/users' },
    { label: 'Métriques Utilisateurs', icon: 'people', route: '/admin/user-metrics' },
    { label: 'Analyses Nutritionnelles', icon: 'restaurant', route: '/admin/nutrition' },
    { label: 'Statistiques Fitness', icon: 'fitness_center', route: '/admin/fitness' },
    { label: 'KPIs Business', icon: 'bar_chart', route: '/admin/kpi' },
    { label: 'Validation des données', icon: 'checklist', route: '/admin/data-check' },
    { label: 'Gestion des données', icon: 'edit_note', route: '/admin/manage' },
  ];

  /* User menu items (sidebar for desktop) */
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

  /* Bottom nav for mobile */
  protected bottomNavItems = [
    { label: 'Menu', icon: 'home', route: '/recipes' },
    { label: 'Explorer', icon: 'explore', route: '/sport-programs' },
    { label: 'Recettes', icon: 'restaurant_menu', route: '/ingredients' },
    { label: 'Social', icon: 'people', route: '/biometrics' },
    { label: 'Profil', icon: 'person', route: '/profile' },
  ];

  protected currentMenuItems = computed(() =>
    this.isAdmin() ? this.adminMenuItems : this.userMenuItems
  );

  protected toolbarTitle = computed(() =>
    this.isAdmin() ? 'Administration' : 'HealthAI Coach'
  );

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    protected auth: AuthService,
  ) {
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

  logout() {
    this.auth.logout();
  }
}
