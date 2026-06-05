// Spec: App | Purpose: Validates expected behavior with automated tests.
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

import { App } from './app';
import { AuthService } from './services/auth.service';

describe('App', () => {
  const authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['logout']);
  const breakpointObserverSpy = jasmine.createSpyObj<BreakpointObserver>('BreakpointObserver', ['observe']);

  beforeEach(async () => {
    const breakpointState: BreakpointState = { matches: false, breakpoints: {} };
    breakpointObserverSpy.observe.and.returnValue(of(breakpointState));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, App],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: BreakpointObserver, useValue: breakpointObserverSpy },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.toolbar-title')?.textContent).toContain('HealthAI Coach');
  });
});
