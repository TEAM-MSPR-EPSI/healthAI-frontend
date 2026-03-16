// Component: LostAccount | Purpose: Renders and manages UI behavior for this view.
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lost-account',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './lost-account.component.html',
  styleUrl: './lost-account.component.css',
})
export class LostAccountComponent {
  email = '';

  constructor(private router: Router) {}

  submit() {
    alert('Un lien de récupération a été envoyé (exemple)');
    this.router.navigate(['/login']);
  }

  back() {
    this.router.navigate(['/login']);
  }
}
