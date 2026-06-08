import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

type Screen = 'intro' | 'warmup' | 'exercise' | 'done';

interface ExerciseStep {
  name: string;
  description: string;
  duration: number; // secondes
  order: number;
}

@Component({
  selector: 'app-session-start',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './session-start.component.html',
  styleUrl: './session-start.component.css',
})
export class SessionStartComponent implements OnInit, OnDestroy {
  session: any = null;
  isPlaying = false;
  totalDuration: number | null = null;

  // ── Player state ──────────────────────────────────────
  screen: Screen = 'intro';
  steps: ExerciseStep[] = [];
  currentIndex = 0;
  totalSeconds = 20;
  remainingSeconds = 20;
  isPaused = false;
  private intervalId: any = null;

  // SVG ring
  readonly RADIUS = 100;
  readonly CIRCUMFERENCE = 2 * Math.PI * this.RADIUS;

  @ViewChild('videoRef') videoRef?: ElementRef<HTMLVideoElement>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private auth: AuthService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (Number.isFinite(id) && id > 0) {
      this.api.getSession(id).subscribe({
        next: (session) => {
          this.session = session;
          const exercises: any[] = Array.isArray(session?.exercises) ? session.exercises : [];
          this.totalDuration = this.computeTotalDuration(exercises);
          const sorted = [...exercises].sort(
            (a, b) =>
              (a.sport_session_exercise_order ?? a.exercise_order ?? 0) -
              (b.sport_session_exercise_order ?? b.exercise_order ?? 0),
          );
          this.steps = sorted.map((ex, i) => ({
            name: ex.sport_exercise_name ?? ex.exercise_name ?? `Exercice #${i + 1}`,
            description: ex.sport_exercise_description ?? ex.exercise_description ?? '',
            duration: (Number(ex.sport_exercise_duration) || 5) * 60,
            order: ex.sport_session_exercise_order ?? ex.exercise_order ?? i + 1,
          }));
        },
      });
    }
  }

  ngOnDestroy() { this.clearTimer(); }

  // ── Getters ───────────────────────────────────────────
  get currentStep(): ExerciseStep | null { return this.steps[this.currentIndex] ?? null; }
  get progressRatio(): number { return 1 - this.remainingSeconds / this.totalSeconds; }
  get strokeDashoffset(): number { return this.CIRCUMFERENCE * (1 - this.progressRatio); }
  get formattedTime(): string {
    const m = Math.floor(this.remainingSeconds / 60);
    const s = this.remainingSeconds % 60;
    return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`;
  }

  // ── Intro actions ─────────────────────────────────────
  toggleVideo() {
    const v = this.videoRef?.nativeElement;
    if (!v) return;
    v.paused ? v.play() : v.pause();
    this.isPlaying = !v.paused;
  }

  goBack() { this.router.navigate(['..'], { relativeTo: this.route }); }

  confirmStart() {
    this.screen = 'warmup';
    this.setTimer(20);
    this.runTimer(() => this.startExercise(0));
  }

  // ── Player actions ────────────────────────────────────
  startExercise(index: number) {
    if (index >= this.steps.length) { this.showDone(); return; }
    this.currentIndex = index;
    this.screen = 'exercise';
    this.setTimer(this.steps[index].duration);
    this.runTimer(() => this.startExercise(index + 1));
  }

  showDone() {
    this.clearTimer();
    this.screen = 'done';
    this.recordSessionProgress();
  }

  private recordSessionProgress(): void {
    const userId = this.auth.currentUser()?.user_id;
    const sessionId = this.session?.sport_session_id;
    if (!userId || !sessionId) return;
    const today = new Date().toISOString().split('T')[0];
    const programId = this.route.snapshot.queryParamMap.get('programId');
    const rank = this.route.snapshot.queryParamMap.get('rank');
    this.api.createSessionProgress({
      user_id: userId,
      sport_session_id: sessionId,
      session_progress_start: today,
      session_progress_end: today,
      ...(programId ? { sport_program_id: Number(programId) } : {}),
      ...(rank ? { program_session_rank: Number(rank) } : {}),
    }).subscribe({ error: (e) => console.error('session-progress error', e) });
  }

  togglePause() { this.isPaused = !this.isPaused; }

  skip() {
    this.clearTimer();
    if (this.screen === 'warmup') this.startExercise(0);
    else if (this.screen === 'exercise') this.startExercise(this.currentIndex + 1);
  }

  backToSessions() { this.router.navigate(['/user/sport-sessions']); }

  // ── Timer helpers ─────────────────────────────────────
  private computeTotalDuration(exercises: any[]): number {
    return exercises.reduce((sum, ex) => sum + (Number(ex.sport_exercise_duration) || 0), 0);
  }

  private setTimer(seconds: number) {
    this.totalSeconds = seconds;
    this.remainingSeconds = seconds;
    this.isPaused = false;
  }

  private runTimer(onComplete: () => void) {
    this.clearTimer();
    this.intervalId = setInterval(() => {
      if (this.isPaused) return;
      this.remainingSeconds--;
      if (this.remainingSeconds <= 0) { this.clearTimer(); onComplete(); }
    }, 1000);
  }

  private clearTimer() {
    if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
  }
}