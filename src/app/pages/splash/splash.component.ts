// Component: Splash | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  templateUrl: './splash.component.html',
  styleUrl: './splash.component.css',
})
export class SplashComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit() {
    setTimeout(() => {
      if (this.auth.isLoggedIn()) {
        this.router.navigate(['/recipes']);
      } else {
        this.router.navigate(['/welcome']);
      }
    }, 2500);
  }
}
