// Component: ProgramDetail | Purpose: Renders and manages UI behavior for this view.
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-program-detail',
  standalone: true,
  imports: [RouterLink, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatProgressBarModule],
  templateUrl: './program-detail.component.html',
  styleUrl: './program-detail.component.css',
})
export class ProgramDetailComponent implements OnInit {
  program: any = null;
  loading = true;

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isFinite(id) && id > 0) {
      this.api.getProgram(id).subscribe({
        next: (data) => {
          this.program = data;
          this.loading = false;
        },
        error: () => { this.loading = false; },
      });
    } else {
      this.loading = false;
    }
  }
}
