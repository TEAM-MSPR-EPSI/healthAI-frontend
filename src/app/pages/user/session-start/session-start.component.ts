import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
  ElementRef,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';

@Component({
  selector: 'app-session-start',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './session-start.component.html',
  styleUrl: './session-start.component.css',
})
export class SessionStartComponent implements OnChanges {
  /** Données de la séance à afficher */
  @Input() session: any = null;

  /** Contrôle l'affichage du panneau */
  @Input() visible = false;

  /** Émis quand l'utilisateur ferme sans lancer */
  @Output() closed = new EventEmitter<void>();

  /** Émis quand l'utilisateur confirme le lancement */
  @Output() started = new EventEmitter<number>();

  @ViewChild('videoRef') videoRef?: ElementRef<HTMLVideoElement>;

  isPlaying = false;

  constructor(private router: Router) {}

  ngOnChanges(changes: SimpleChanges) {
    // Quand on ferme, on arrête la vidéo
    if (changes['visible'] && !this.visible) {
      this.pauseVideo();
    }
  }

  toggleVideo() {
    const video = this.videoRef?.nativeElement;
    if (!video) return;
    if (video.paused) {
      video.play();
      this.isPlaying = true;
    } else {
      video.pause();
      this.isPlaying = false;
    }
  }

  pauseVideo() {
    const video = this.videoRef?.nativeElement;
    if (video && !video.paused) {
      video.pause();
      this.isPlaying = false;
    }
  }

  close() {
    this.pauseVideo();
    this.closed.emit();
  }

  /** Ferme si on clique sur l'overlay (hors panneau) */
  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('overlay')) {
      this.close();
    }
  }

  confirmStart() {
    if (this.session?.sport_session_id) {
      this.started.emit(this.session.sport_session_id);
      // Navigation directe vers la séance avec flag ?start=true
      this.router.navigate(
        ['/user/sport-sessions', this.session.sport_session_id],
        { queryParams: { start: true } }
      );
    }
  }
}
