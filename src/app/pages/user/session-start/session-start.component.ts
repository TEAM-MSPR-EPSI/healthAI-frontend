import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-session-start',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './session-start.component.html',
  styleUrl: './session-start.component.css',
})
export class SessionStartComponent implements OnInit {
  session: any = null;
  isPlaying = false;
  totalDuration: number | null = null;

  @ViewChild('videoRef') videoRef?: ElementRef<HTMLVideoElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isFinite(id) && id > 0) {
      this.api.getSession(id).subscribe({
        next: (session) => {
          this.session = session;
          if (Array.isArray(session?.exercises)) {
            this.totalDuration = this.computeTotalDuration(session.exercises);
          }
        },
      });
    }
  }

  private computeTotalDuration(exercises: any[]): number {
    return exercises.reduce((sum, ex) => sum + (Number(ex.sport_exercise_duration) || 0), 0);
  }

  toggleVideo() {
    const v = this.videoRef?.nativeElement;
    if (!v) return;
    v.paused ? v.play() : v.pause();
    this.isPlaying = !v.paused;
  }

  goBack() {
    this.router.navigate(['..'], { relativeTo: this.route });
  }

  confirmStart() {
    const id = this.session?.sport_session_id;
    if (id) {
      this.router.navigate(['/user/sport-sessions', id], {
        queryParams: { start: true },
      });
    }
  }
}