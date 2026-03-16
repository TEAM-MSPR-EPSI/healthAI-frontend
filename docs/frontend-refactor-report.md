# Frontend Refactor Report

## 1. Liste des Components

## App

But : Hosts the global shell, navigation logic, and route outlet.

Responsabilités :
- Controls responsive layout state and shell visibility.
- Switches menu content between user and admin contexts.

Dépendances :
- AuthService
- SidebarComponent

## SidebarComponent

But : Displays the lateral navigation menu with active state.

Responsabilités :
- Renders menu items and emits navigation interactions.
- Supports desktop and mobile shell navigation.

Dépendances :
- None

## SplashComponent

But : Handles startup redirection based on authentication state.

Responsabilités :
- Checks session state on app launch.
- Redirects to onboarding or main pages.

Dépendances :
- AuthService

## WelcomeComponent

But : Displays the landing welcome page for new users.

Responsabilités :
- Presents product intro and first-step call-to-action.
- Routes users toward login/registration flow.

Dépendances :
- None

## LoginComponent

But : Authenticates users and starts a session.

Responsabilités :
- Manages login form validation and submit.
- Navigates after successful authentication.

Dépendances :
- AuthService

## RegisterComponent

But : Creates user accounts from registration form input.

Responsabilités :
- Captures and validates registration data.
- Calls user creation and immediate login workflow.

Dépendances :
- ApiService
- AuthService

## LostAccountComponent

But : Displays account recovery user interface.

Responsabilités :
- Collects recovery information from user input.
- Guides users through password/account recovery flow.

Dépendances :
- None

## OnboardingNameComponent

But : Collects identity information during onboarding.

Responsabilités :
- Captures first onboarding step fields.
- Stores temporary onboarding data for next step.

Dépendances :
- None

## OnboardingGoalComponent

But : Collects nutrition and fitness goals during onboarding.

Responsabilités :
- Allows users to select objective preferences.
- Finalizes onboarding progression.

Dépendances :
- None

## HomeComponent

But : Displays the user home entry page after authentication.

Responsabilités :
- Shows primary dashboard shortcuts.
- Handles auth-aware navigation behavior.

Dépendances :
- AuthService

## RecipesComponent

But : Orchestrates the recipes page sections and data loading.

Responsabilités :
- Loads recipes list from API.
- Composes category carousel and recipe grid child components.

Dépendances :
- ApiService
- RecipeCategoryCarouselComponent
- RecipesGridComponent

## RecipeCategoryCarouselComponent

But : Displays recipe categories in horizontal card carousels.

Responsabilités :
- Renders category groups and mini recipe cards.
- Keeps category block presentation independent from page logic.

Dépendances :
- None

## RecipesGridComponent

But : Displays API recipes in responsive card grid layout.

Responsabilités :
- Renders recipe cards and empty/loading states.
- Handles recipe detail navigation links.

Dépendances :
- None

## RecipeDetailComponent

But : Displays a single recipe detailed view.

Responsabilités :
- Loads recipe details from route id.
- Presents complete recipe content and metadata.

Dépendances :
- ApiService

## IngredientsComponent

But : Displays ingredient list loaded from API.

Responsabilités :
- Fetches ingredient data.
- Renders nutritional ingredient cards/list.

Dépendances :
- ApiService

## ProfileComponent

But : Displays and edits the authenticated user profile.

Responsabilités :
- Initializes profile form from current user.
- Persists profile updates through API endpoint.

Dépendances :
- AuthService
- ApiService

## BiometricsComponent

But : Displays user biometric and body metrics view.

Responsabilités :
- Renders key biometric indicators and progress.
- Provides quick access to health metric sections.

Dépendances :
- None

## SportProgramsComponent

But : Displays available sport programs list.

Responsabilités :
- Loads programs from API.
- Renders cards and detail navigation links.

Dépendances :
- ApiService

## ProgramDetailComponent

But : Displays detailed content for one sport program.

Responsabilités :
- Resolves program id from route params.
- Fetches and renders program details.

Dépendances :
- ApiService

## SportSessionsComponent

But : Displays available sport sessions list.

Responsabilités :
- Loads sessions data from API.
- Renders session cards and navigation actions.

Dépendances :
- ApiService

## SessionDetailComponent

But : Displays one sport session detailed view.

Responsabilités :
- Reads route id and loads session details.
- Renders detailed session content.

Dépendances :
- ApiService

## ExercisesComponent

But : Displays available exercises list.

Responsabilités :
- Fetches exercise data from API.
- Renders exercise cards and metadata.

Dépendances :
- ApiService

## EquipmentComponent

But : Displays available sport equipment list.

Responsabilités :
- Loads equipment data from API.
- Renders equipment list/cards.

Dépendances :
- ApiService

## AdminDashboardComponent

But : Displays the admin dashboard landing page.

Responsabilités :
- Presents global admin KPIs and overview blocks.
- Exposes navigation entry points to admin areas.

Dépendances :
- None

## UserMetricsComponent

But : Displays user-related analytics for administrators.

Responsabilités :
- Shows user volume and engagement indicators.
- Supports admin monitoring of user behavior.

Dépendances :
- None

## NutritionComponent

But : Displays admin nutrition analytics page.

Responsabilités :
- Shows nutritional indicators and trends.
- Provides admin-level nutrition monitoring UI.

Dépendances :
- None

## FitnessComponent

But : Displays admin fitness analytics page.

Responsabilités :
- Shows fitness activity indicators.
- Supports admin-level performance monitoring.

Dépendances :
- None

## KpiComponent

But : Displays business KPI cards and trend widgets.

Responsabilités :
- Renders KPI values and trends for admin.
- Provides summary view for business metrics.

Dépendances :
- None

## DataCheckingPageComponent

But : Displays data quality validation page for admin.

Responsabilités :
- Shows consistency and validation controls.
- Supports verification workflow for data quality.

Dépendances :
- None

## AdminManageComponent

But : Orchestrates CRUD management of core entities in admin.

Responsabilités :
- Loads data for recipes, ingredients, programs, sessions, exercises, and equipment.
- Handles edit/delete orchestration and tab-level logic.

Dépendances :
- ApiService
- AdminEntityTableComponent

## AdminEntityTableComponent

But : Renders and edits a generic admin entity table.

Responsabilités :
- Displays columns/rows from input configuration.
- Emits edit/save/cancel/delete actions to parent orchestrator.

Dépendances :
- None

## 2. Components trop gros

### Cibles identifiées

- AdminManageComponent
- RecipesComponent
- ProfileComponent

### Refactoring appliqué

- AdminManageComponent was split into:
  - AdminManageComponent (container/orchestrator)
  - AdminEntityTableComponent (table rendering + inline editing UI)
  - admin-manage.config.ts (tabs, id keys, column definitions)
- RecipesComponent was split into:
  - RecipesComponent (container/data loader)
  - RecipeCategoryCarouselComponent (category UI)
  - RecipesGridComponent (API recipe grid UI)

### Rôle des nouveaux petits components

- AdminEntityTableComponent: keeps table logic reusable and isolated from API orchestration.
- RecipeCategoryCarouselComponent: isolates category presentation and horizontal scrolling.
- RecipesGridComponent: isolates recipe cards rendering and empty state.

## 3. Organisation Angular proposée

Structure cible recommandée :

```text
src/app
  core
    services
      api.service.ts
      auth.service.ts
    config
      app.config.ts
    routing
      app.routes.ts

  shared
    components
      sidebar/
      ui/
    pipes
    models

  features
    nutrition
      pages/
      components/
    workout
      pages/
      components/
    dashboard
      pages/
      components/
    admin
      pages/
      components/
```

Règles d'organisation :
- core: singleton services, app config, routing, guards/interceptors.
- shared: reusable UI building blocks without feature business rules.
- features: domain-specific pages/components grouped by business capability.

## 4. Refactoring Bootstrap / CSS

Structure SCSS créée :

```text
src/styles/
  _colors.scss
  _variables.scss
  _mixins.scss
  _buttons.scss
  _bootstrap-overrides.scss
  main.scss
```

Points appliqués :
- All global style entry now goes through src/styles/main.scss.
- Color tokens are centralized in src/styles/_colors.scss.
- Reusable mixins are in src/styles/_mixins.scss.
- Custom buttons are in src/styles/_buttons.scss:
  - .btn-primary-custom
  - .btn-secondary-custom
- Angular config now points to src/styles/main.scss for build and test.

## 5. Règles CSS

Règles appliquées :
- No inline style introduced in refactored files.
- New shared styles use centralized variables.
- Repetitive UI patterns (cards/buttons/layout) are moved to shared SCSS partials.

Règles à poursuivre sur les anciens composants :
- Replace remaining fallback hardcoded colors in legacy component CSS by design tokens from _colors.scss.
- Continue extracting repeated layout snippets into mixins.

## 6. Uniformisation des commentaires TypeScript

Règle appliquée sur les fichiers TS front :

```ts
// Component: Name | Purpose: ...
// Service: Name | Purpose: ...
```

Un commentaire d'entête 1 ligne en anglais a été ajouté sur les fichiers TypeScript du frontend.

## Résultat du refactoring

- Frontend code is now more modular on the most complex screens.
- Styling is centralized with a single SCSS entrypoint and shared tokens.
- Component responsibilities are clearer between container components and presentational components.
- TypeScript files now follow a uniform documentation header convention.
