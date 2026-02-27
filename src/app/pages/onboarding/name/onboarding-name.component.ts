import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-onboarding-name',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './onboarding-name.component.html',
  styleUrl: './onboarding-name.component.css',
})
export class OnboardingNameComponent {
  firstName = '';

  constructor(private router: Router) {}

  next() {
    this.router.navigate(['/onboarding/goal']);
  }
}
