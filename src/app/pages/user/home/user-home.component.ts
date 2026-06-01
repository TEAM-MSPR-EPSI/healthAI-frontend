import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-user-home',
  standalone: true,
  imports: [RouterLink, MatIcon],
  templateUrl: './user-home.component.html',
  styleUrl: './user-home.component.css',
})
export class UserHomeComponent {}
