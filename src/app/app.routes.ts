// Routes: App.routes | Purpose: Defines navigation routes for the application.
import { Routes } from '@angular/router';

// Auth & onboarding pages
import { SplashComponent } from './pages/splash/splash.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OnboardingNameComponent } from './pages/onboarding/name/onboarding-name.component';
import { OnboardingGoalComponent } from './pages/onboarding/goal/onboarding-goal.component';
import { LostAccountComponent } from './pages/lost-account/lost-account.component';

// Public / user pages
import { HomeComponent } from './pages/home/home.component';
import { RecipesComponent } from './pages/recipes/recipes.component';
import { RecipeDetailComponent } from './pages/recipes/recipe-detail.component';
import { IngredientsComponent } from './pages/ingredients/ingredients.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ConsultantProfileComponent } from './pages/consultant-profile/consultant-profile.component';
import { BiometricsComponent } from './pages/biometrics/biometrics.component';
import { SportProgramsComponent } from './pages/sport-programs/sport-programs.component';
import { ProgramDetailComponent } from './pages/sport-programs/program-detail.component';
import { SportSessionsComponent } from './pages/sport-sessions/sport-sessions.component';
import { SessionDetailComponent } from './pages/sport-sessions/session-detail.component';
import { ExercisesComponent } from './pages/exercises/exercises.component';
import { EquipmentComponent } from './pages/equipment/equipment.component';

// Admin pages
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard.component';
import { UserMetricsComponent } from './pages/admin/user-metrics/user-metrics.component';
import { NutritionComponent } from './pages/admin/nutrition/nutrition.component';
import { FitnessComponent } from './pages/admin/fitness/fitness.component';
import { KpiComponent } from './pages/admin/kpi/kpi.component';
import { DataCheckingPageComponent } from './pages/admin/data-checking/data-checking-page.component';
import { AdminManageComponent } from './pages/admin/manage/admin-manage.component';

export const routes: Routes = [
  // Splash & onboarding flow
  { path: '', component: SplashComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'onboarding/name', component: OnboardingNameComponent },
  { path: 'onboarding/goal', component: OnboardingGoalComponent },
  { path: 'lost-account', component: LostAccountComponent },

  // User pages
  { path: 'home', component: HomeComponent },
  { path: 'recipes', component: RecipesComponent },
  { path: 'recipes/:id', component: RecipeDetailComponent },
  { path: 'ingredients', component: IngredientsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'consultant', component: ConsultantProfileComponent },
  { path: 'biometrics', component: BiometricsComponent },
  { path: 'sport-programs', component: SportProgramsComponent },
  { path: 'sport-programs/:id', component: ProgramDetailComponent },
  { path: 'sport-sessions', component: SportSessionsComponent },
  { path: 'sport-sessions/:id', component: SessionDetailComponent },
  { path: 'exercises', component: ExercisesComponent },
  { path: 'equipment', component: EquipmentComponent },

  // Admin
  { path: 'admin', component: AdminDashboardComponent },
  { path: 'admin/user-metrics', component: UserMetricsComponent },
  { path: 'admin/nutrition', component: NutritionComponent },
  { path: 'admin/fitness', component: FitnessComponent },
  { path: 'admin/kpi', component: KpiComponent },
  { path: 'admin/data-check', component: DataCheckingPageComponent },
  { path: 'admin/manage', component: AdminManageComponent },
];
