// Service: Auth | Purpose: Handles shared business logic and API interactions.
import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { firstValueFrom } from 'rxjs';

const STORAGE_KEY = 'healthai_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private _currentUser = signal<any>(this.loadFromStorage());

  readonly currentUser = this._currentUser.asReadonly();

  constructor(private api: ApiService, private router: Router) {}

  async login(email: string, password: string): Promise<void> {
    const authResponse = await firstValueFrom(this.api.login(email, password));
    const userId = this.extractUserIdFromToken(authResponse.token);

    if (!userId) {
      throw new Error('Invalid token payload');
    }

    try {
      const user = await firstValueFrom(this.api.getUser(String(userId)));
      this.setUser({ ...user, token: authResponse.token });
    } catch {
      this.setUser({ user_id: userId, token: authResponse.token });
    }
  }

  async register(email: string, password: string): Promise<void> {
    const usernamePrefix = email.split('@')[0]?.replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'user';
    const fallbackDate = new Date().getTime();
    const payload = {
      email,
      password,
      user_email: email,
      user_username: `${usernamePrefix}${fallbackDate}`,
      user_lastname: 'Lastname',
      user_firstname: 'Firstname',
      user_birth: '2000-01-01',
      user_gender: 'prefer_not_to_say',
      user_phone: '0000000000',
      user_size: 170,
      user_weight: 70,
    };

    await firstValueFrom(this.api.register(payload));
    await this.login(email, password);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this._currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!this._currentUser();
  }

  async updateCurrentUserProfile(data: Record<string, any>): Promise<void> {
    const currentUser = this._currentUser();
    const userId = Number(currentUser?.user_id);

    if (!Number.isFinite(userId)) {
      throw new Error('No authenticated user');
    }

    const updatedUser = await firstValueFrom(this.api.updateUser(String(userId), data));
    this.setUser({ ...currentUser, ...updatedUser });
  }

  async updateCurrentUserFirstName(firstName: string): Promise<void> {
    await this.updateCurrentUserProfile({ user_firstname: firstName });
  }

  async updateCurrentUserRole(role: 'user' | 'company_admin'): Promise<void> {
    await this.updateCurrentUserProfile({ user_role: role });
  }

  private setUser(user: any): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    this._currentUser.set(user);
  }

  private extractUserIdFromToken(token: string): number | null {
    try {
      const tokenPart = token.split('.')[1];
      if (!tokenPart) {
        return null;
      }

      const normalized = tokenPart.replace(/-/g, '+').replace(/_/g, '/');
      const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
      const payload = JSON.parse(atob(padded));
      const userId = Number(payload?.id);

      return Number.isFinite(userId) ? userId : null;
    } catch {
      return null;
    }
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
