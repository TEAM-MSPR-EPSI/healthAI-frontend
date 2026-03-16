// Service: Auth | Purpose: Handles shared business logic and API interactions.
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';

const STORAGE_KEY = 'healthai_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<any>(this.loadFromStorage());

  readonly currentUser = this._currentUser.asReadonly();

  constructor(private api: ApiService, private router: Router) {}

  login(email: string, password: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.api.login(email, password).subscribe({
        next: (user) => {
          this.setUser(user);
          resolve();
        },
        error: (err) => reject(err),
      });
    });
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this._currentUser();
  }

  private setUser(user: any): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this._currentUser.set(user);
  }

  private loadFromStorage(): any {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
}
