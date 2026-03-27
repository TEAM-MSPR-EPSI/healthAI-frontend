// Routes: App.routes | Purpose: Defines navigation routes for the application.
import { Routes } from '@angular/router';

// Auth & onboarding pages
import { SplashComponent } from './pages/splash/splash.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { OnboardingRoleComponent } from './pages/onboarding/role/onboarding-role.component';
import { OnboardingNameComponent } from './pages/onboarding/name/onboarding-name.component';
import { OnboardingPersonalComponent } from './pages/onboarding/personal/onboarding-personal.component';
import { OnboardingMetricsComponent } from './pages/onboarding/metrics/onboarding-metrics.component';
import { OnboardingGoalComponent } from './pages/onboarding/goal/onboarding-goal.component';
import { OnboardingCompanyContactComponent } from './pages/onboarding/company-contact/onboarding-company-contact.component';
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
import { AdminUsersListComponent } from './pages/admin/user-list/admin-users-list.component';
import { AdminUserDetailComponent } from './pages/admin/user-detail/admin-user-detail.component';
import { adminOnlyGuard } from './guards/admin-only.guard';

export const routes: Routes = [
  // Splash & onboarding flow
  { path: '', component: SplashComponent },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'onboarding/role', component: OnboardingRoleComponent },
  { path: 'onboarding/name', component: OnboardingNameComponent },
  { path: 'onboarding/personal', component: OnboardingPersonalComponent },
  { path: 'onboarding/metrics', component: OnboardingMetricsComponent },
  { path: 'onboarding/goal', component: OnboardingGoalComponent },
  { path: 'onboarding/company-contact', component: OnboardingCompanyContactComponent },
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
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/user-list', component: AdminUsersListComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/users/:id', component: AdminUserDetailComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/user-metrics', component: UserMetricsComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/nutrition', component: NutritionComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/fitness', component: FitnessComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/kpi', component: KpiComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/data-check', component: DataCheckingPageComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/manage', component: AdminManageComponent, canActivate: [adminOnlyGuard] },
];
