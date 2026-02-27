import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  profile = {
    firstName: 'Jean',
    lastName: 'Dupont',
    email: 'jean.dupont@email.com',
    phone: '06 12 34 56 78',
    birthDate: new Date(1992, 4, 15),
    gender: 'male',
    height: 178,
    goal: 'weight_loss',
  };

  goals = [
    { value: 'weight_loss', label: 'Perte de poids' },
    { value: 'muscle_gain', label: 'Prise de masse' },
    { value: 'fitness', label: 'Remise en forme' },
    { value: 'maintenance', label: 'Maintien' },
  ];

  save() {
    // Placeholder
    alert('Profil sauvegardé (exemple)');
  }
}
