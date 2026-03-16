// Component: Home | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['/recipes']);
    }
  }
}
