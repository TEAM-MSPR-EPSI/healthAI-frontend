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

// Public pages
import { HomeComponent } from './pages/home/home.component';
import { Subscribe } from './pages/subscribe/subscribe';

// User pages
import { UserHomeComponent } from './pages/user/home/user-home.component';
import { RecipesComponent } from './pages/user/recipes/recipes.component';
import { RecipeDetailComponent } from './pages/user/recipes/recipe-detail.component';
import { IngredientsComponent } from './pages/user/ingredients/ingredients.component';
import { ManageIngredientsComponent } from './pages/user/ingredients/manage-ingredients.component';
import { ProfileComponent } from './pages/user/profile/profile.component';
import { ConsultantProfileComponent } from './pages/user/consultant-profile/consultant-profile.component';
import { BiometricsComponent } from './pages/user/biometrics/biometrics.component';
import { ManageBiometricsComponent } from './pages/user/biometrics/manage-biometrics.component';
import { SportProgramsComponent } from './pages/user/sport-programs/sport-programs.component';
import { ProgramDetailComponent } from './pages/user/program-detail/program-detail.component';
import { SportSessionsComponent } from './pages/user/sport-sessions/sport-sessions.component';
import { SessionDetailComponent } from './pages/user/sport-sessions/session-detail.component';
import { ExercisesComponent } from './pages/user/exercises/exercises.component';
import { EquipmentComponent } from './pages/user/equipment/equipment.component';
import { SessionStartComponent } from './pages/user/session-start/session-start.component';
import { FoodLogComponent } from './pages/user/food-log/food-log.component';


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
import { EtlNutritionComponent } from './pages/admin/etl/nutrition/etl-nutrition.component';
import { EtlExerciseComponent } from './pages/admin/etl/exercise/etl-exercise.component';
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
  { path: 'home', component: HomeComponent },
  { path: 'subscribe', component: Subscribe },

  // User pages
  { path: 'user/home', component: UserHomeComponent },
  { path: 'user/subscribe', component: Subscribe },
  { path: 'user/recipes', component: RecipesComponent },
  { path: 'user/recipes/:id', component: RecipeDetailComponent },
  { path: 'user/ingredients', component: IngredientsComponent },
  { path: 'user/ingredients/manage', component: ManageIngredientsComponent },
  { path: 'user/profile', component: ProfileComponent },
  { path: 'user/consultant', component: ConsultantProfileComponent },
  { path: 'user/biometrics', component: BiometricsComponent },
  { path: 'user/biometrics/manage', component: ManageBiometricsComponent },
  { path: 'user/sport-programs', component: SportProgramsComponent },
  { path: 'user/sport-programs/:id', component: ProgramDetailComponent },
  { path: 'user/sport-sessions', component: SportSessionsComponent },
  { path: 'user/sport-sessions/:id', component: SessionDetailComponent },
  { path: 'user/exercises', component: ExercisesComponent },
  { path: 'user/equipment', component: EquipmentComponent },
  { path: 'user/sport-sessions/:id/start', component: SessionStartComponent },
  { path: 'user/food-log', component: FoodLogComponent },

  
  // Admin
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/user-list', component: AdminUsersListComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/users/:id', component: AdminUserDetailComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/user-metrics', component: UserMetricsComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/nutrition', component: NutritionComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/fitness', component: FitnessComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/kpi', component: KpiComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/data-check', component: DataCheckingPageComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/etl/nutrition', component: EtlNutritionComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/etl/exercise', component: EtlExerciseComponent, canActivate: [adminOnlyGuard] },
  { path: 'admin/manage', component: AdminManageComponent, canActivate: [adminOnlyGuard] },
  // Wildcard
  { path: '**', redirectTo: '' }
];

