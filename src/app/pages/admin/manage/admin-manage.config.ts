// Config: AdminManageConfig | Purpose: Centralizes tabs, column mappings, and identity keys for admin data management.
export interface TabConfig {
  key: string;
  label: string;
  icon: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
}

export const ADMIN_MANAGE_TABS: TabConfig[] = [
  { key: 'recipes', label: 'Recettes', icon: 'restaurant_menu' },
  { key: 'ingredients', label: 'Ingrédients', icon: 'egg' },
  { key: 'programs', label: 'Programmes', icon: 'fitness_center' },
  { key: 'sessions', label: 'Séances', icon: 'event' },
  { key: 'exercises', label: 'Exercices', icon: 'sports_gymnastics' },
  { key: 'equipment', label: 'Matériel', icon: 'build' },
];

export const ADMIN_MANAGE_COLUMNS: Record<string, ColumnConfig[]> = {
  recipes: [
    { key: 'recipe_id', label: 'ID' },
    { key: 'recipe_name', label: 'Nom' },
    { key: 'recipe_description', label: 'Description' },
    { key: 'recipe_type', label: 'Type' },
  ],
  ingredients: [
    { key: 'ingredient_id', label: 'ID' },
    { key: 'ingredient_name', label: 'Nom' },
    { key: 'ingredient_type', label: 'Type' },
    { key: 'ingredient_energy_100g', label: 'kcal/100g' },
    { key: 'ingredient_protein_100g', label: 'Prot.' },
    { key: 'ingredient_carbohydrate_100g', label: 'Gluc.' },
    { key: 'ingredient_fats_100g', label: 'Lip.' },
  ],
  programs: [
    { key: 'sport_program_id', label: 'ID' },
    { key: 'sport_program_name', label: 'Nom' },
    { key: 'sport_program_objective', label: 'Objectif' },
    { key: 'sport_program_sessions', label: 'Séances' },
    { key: 'sport_program_duration', label: 'Durée (j)' },
  ],
  sessions: [
    { key: 'sport_session_id', label: 'ID' },
    { key: 'sport_session_name', label: 'Nom' },
  ],
  exercises: [
    { key: 'sport_exercise_id', label: 'ID' },
    { key: 'sport_exercise_name', label: 'Nom' },
    { key: 'sport_exercise_objective', label: 'Objectif' },
    { key: 'sport_exercise_difficulty', label: 'Difficulté' },
    { key: 'sport_exercise_muscle_group', label: 'Muscle' },
    { key: 'sport_exercise_cal_burned', label: 'kcal' },
  ],
  equipment: [
    { key: 'sport_equipment_id', label: 'ID' },
    { key: 'sport_equipment_name', label: 'Nom' },
  ],
};

export const ADMIN_MANAGE_ID_KEYS: Record<string, string> = {
  recipes: 'recipe_id',
  ingredients: 'ingredient_id',
  programs: 'sport_program_id',
  sessions: 'sport_session_id',
  exercises: 'sport_exercise_id',
  equipment: 'sport_equipment_id',
};
