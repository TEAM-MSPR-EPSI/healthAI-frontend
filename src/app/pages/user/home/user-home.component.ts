import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css',
})
export class UserHomeComponent implements OnInit {
  userName: string = 'Utilisateur';

  constructor(private auth: AuthService) {}

  ngOnInit() {
    // Charger le nom de l'utilisateur si disponible
    // this.userName = this.auth.getCurrentUserName();
  }
}
