import { Component, signal } from '@angular/core';
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

  /* Menu items */
  protected menuItems: MenuItem[] = [
    { label: 'Métriques Utilisateurs', icon: 'people', route: '/user-metrics' },
    { label: 'Analyses Nutritionnelles', icon: 'restaurant', route: '/nutrition' },
    { label: 'Statistiques Fitness', icon: 'fitness_center', route: '/fitness' },
    { label: 'KPIs Business', icon: 'bar_chart', route: '/kpi' },
    { label: 'Validation des données', icon: 'checklist', route: '/data-check' },
  ];

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) {
    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe((result) => {
      this.isMobile.set(result.matches);
      this.sidenavOpened.set(!result.matches);
    });

    // Hide toolbar/sidebar on login & register pages
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const url = e.urlAfterRedirects || e.url;
        this.showShell.set(!/^\/(login|register)/.test(url));
      });
  }

  toggleSidenav() {
    this.sidenavOpened.set(!this.sidenavOpened());
  }
}
