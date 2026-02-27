import { Routes } from '@angular/router';

// Auth pages
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';

// Public pages
import { HomeComponent } from './pages/home/home.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { IngredientsComponent } from './pages/ingredients/ingredients.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { BiometricsComponent } from './pages/biometrics/biometrics.component';
import { SportProgramsComponent } from './pages/sport-programs/sport-programs.component';
import { SportSessionsComponent } from './pages/sport-sessions/sport-sessions.component';
import { ExercisesComponent } from './pages/exercises/exercises.component';
import { EquipmentComponent } from './pages/equipment/equipment.component';

// Admin pages
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { UserMetricsComponent } from './pages/admin/user-metrics/user-metrics.component';
import { NutritionComponent } from './pages/admin/nutrition/nutrition.component';
import { FitnessComponent } from './pages/admin/fitness/fitness.component';
import { KpiComponent } from './pages/admin/kpi/kpi.component';
import { DataCheckingPageComponent } from './pages/admin/data-checking/data-checking-page.component';

export const routes: Routes = [
  // Public
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'biometrics', component: BiometricsComponent },
  { path: 'sport-programs', component: SportProgramsComponent },
  { path: 'sport-sessions', component: SportSessionsComponent },
  { path: 'exercises', component: ExercisesComponent },
  { path: 'equipment', component: EquipmentComponent },

  // Admin
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/user-metrics', component: UserMetricsComponent },
  { path: 'admin/nutrition', component: NutritionComponent },
  { path: 'admin/fitness', component: FitnessComponent },
  { path: 'admin/kpi', component: KpiComponent },
  { path: 'admin/data-check', component: DataCheckingPageComponent },
];
