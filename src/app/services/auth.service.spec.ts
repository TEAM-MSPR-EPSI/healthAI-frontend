import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { ApiService } from './api.service';
import { AuthService } from './auth.service';

function buildToken(payload: Record<string, unknown>): string {
  const body = btoa(JSON.stringify(payload)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  return ['header', body, 'signature'].join('.');
}

describe('AuthService', () => {
  let service: AuthService;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    localStorage.clear();

    apiSpy = jasmine.createSpyObj<ApiService>('ApiService', ['login', 'register', 'getUser', 'updateUser']);
    routerSpy = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('logs in and stores the fetched user profile', async () => {
    const token = buildToken({ id: 12, role: 'user' });
    const profile = { user_id: 12, user_firstname: 'Mila' };

    apiSpy.login.and.returnValue(of({ token }));
    apiSpy.getUser.and.returnValue(of(profile));

    await service.login('mila@example.com', 'Password!1');

    expect(apiSpy.login).toHaveBeenCalledWith('mila@example.com', 'Password!1');
    expect(apiSpy.getUser).toHaveBeenCalledWith('12');
    expect(service.currentUser()).toEqual({ ...profile, token });
    expect(JSON.parse(localStorage.getItem('healthai_user') ?? 'null')).toEqual({ ...profile, token });
  });

  it('falls back to token payload when the profile request fails', async () => {
    const token = buildToken({ id: 27, role: 'company_admin' });

    apiSpy.login.and.returnValue(of({ token }));
    apiSpy.getUser.and.returnValue(throwError(() => new Error('profile unavailable')));

    await service.login('admin@example.com', 'Password!1');

    expect(service.currentUser()).toEqual({ user_id: 27, token });
  });

  it('logs out and clears the stored session', async () => {
    const token = buildToken({ id: 8, role: 'user' });

    apiSpy.login.and.returnValue(of({ token }));
    apiSpy.getUser.and.returnValue(of({ user_id: 8, user_firstname: 'Leo' }));

    await service.login('leo@example.com', 'Password!1');
    service.logout();

    expect(localStorage.getItem('healthai_user')).toBeNull();
    expect(service.currentUser()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});