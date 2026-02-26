import { Component, input, output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

export interface MenuItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, MatListModule, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  /** Menu items to display */
  menuItems = input.required<MenuItem[]>();

  /** Whether the viewport is mobile (auto-close on click) */
  isMobile = input<boolean>(false);

  /** Emitted when a link is clicked on mobile so the parent can close the sidenav */
  linkClicked = output<void>();

  onLinkClick(): void {
    if (this.isMobile()) {
      this.linkClicked.emit();
    }
  }
}
