import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subscribe } from './subscribe';

describe('Subscribe', () => {
  let component: Subscribe;
  let fixture: ComponentFixture<Subscribe>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Subscribe]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Subscribe);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
