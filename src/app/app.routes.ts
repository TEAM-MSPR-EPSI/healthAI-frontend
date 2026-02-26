import { Routes } from '@angular/router';

import { UserMetricsComponent } from './pages/user-metrics/user-metrics.component';
import { NutritionComponent } from './pages/nutrition/nutrition.component';
import { FitnessComponent } from './pages/fitness/fitness.component';
import { KpiComponent } from './pages/kpi/kpi.component';
import { DataCheckingPageComponent } from './pages/data-checking/data-checking-page.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'user-metrics', component: UserMetricsComponent },
  { path: 'nutrition', component: NutritionComponent },
  { path: 'fitness', component: FitnessComponent },
  { path: 'kpi', component: KpiComponent },
  { path: 'data-check', component: DataCheckingPageComponent },
];
