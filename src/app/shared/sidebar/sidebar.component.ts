import { Component, input, output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  menuItems = input.required<MenuItem[]>();
  isMobile = input<boolean>(false);
  subtitle = input<string>('Panneau Admin');
  linkClicked = output<void>();

  private router = inject(Router);

  onLinkClick(): void {
    if (this.isMobile()) {
      this.linkClicked.emit();
    }
  }

  isItemActive(route: string): boolean {
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }
}
