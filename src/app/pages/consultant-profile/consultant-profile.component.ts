// Component: ConsultantProfile | Purpose: Display nutritionist profile
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-consultant-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule],
  templateUrl: './consultant-profile.component.html',
  styleUrl: './consultant-profile.component.css',
})
export class ConsultantProfileComponent {
  // Mock nutritionist data
  consultant = {
    name: 'Dr. Sophie Martin',
    specialty: 'Diététicienne - Nutrition Sportive',
    experience: '12 ans',
    bio: 'Experte en nutrition sportive et bien-être. Spécialisée dans l\'optimisation des programmes nutritionnels pour athlètes et sportifs amateurs.',
    qualifications: ['Diplôme d\'État', 'Certification ISSN', 'Master Nutrition Sportive'],
    languages: ['Français', 'Anglais'],
    availability: 'Disponible pour consultations',
    image: '👩‍⚕️',
  };
}
