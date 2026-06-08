import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';

import { Subscribe } from './subscribe';

describe('Subscribe', () => {
  let component: Subscribe;
  let fixture: ComponentFixture<Subscribe>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    snackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, Subscribe],
      providers: [{ provide: MatSnackBar, useValue: snackBarSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(Subscribe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows a confirmation when a plan is selected', () => {
    (component as any).snackBar = snackBarSpy;

    component.selectPlan({
      id: 1,
      name: 'Premium',
      features: ['Suivi', 'Recettes'],
      price: 19,
      popular: true,
    });

    expect(snackBarSpy.open).toHaveBeenCalledWith('Abonnement "Premium" sélectionné', 'OK', {
      duration: 2500,
    });
  });

  it('hides a failed image element', () => {
    const image = document.createElement('img');

    component.onImgError({ target: image } as unknown as Event);

    expect(image.classList.contains('hidden')).toBeTrue();
  });
});
