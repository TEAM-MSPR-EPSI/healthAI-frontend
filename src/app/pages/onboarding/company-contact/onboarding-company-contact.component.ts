import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-company-contact',
  standalone: true,
  imports: [],
  templateUrl: './onboarding-company-contact.component.html',
  styleUrl: './onboarding-company-contact.component.css',
})
export class OnboardingCompanyContactComponent {
  constructor(private router: Router) {}

  back() {
    this.router.navigate(['/onboarding/role']);
  }

  finish() {
    this.router.navigate(['/home']);
  }
}
