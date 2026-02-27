import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-onboarding-goal',
  standalone: true,
  imports: [],
  templateUrl: './onboarding-goal.component.html',
  styleUrl: './onboarding-goal.component.css',
})
export class OnboardingGoalComponent {
  selectedGoal = '';

  goals = [
    { value: 'weight_loss', label: 'Perdre du poids' },
    { value: 'muscle_gain', label: 'Prendre du muscle' },
    { value: 'fitness', label: 'Améliorer ma forme' },
    { value: 'nutrition', label: 'Manger mieux' },
  ];

  constructor(private router: Router) {}

  selectGoal(value: string) {
    this.selectedGoal = value;
  }

  next() {
    // Placeholder: skip remaining onboarding, go to app
    this.router.navigate(['/recipes']);
  }

  back() {
    this.router.navigate(['/onboarding/name']);
  }
}
