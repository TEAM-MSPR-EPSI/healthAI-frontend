// Config: AdminManageConfig | Purpose: Centralizes tabs, column mappings, and identity keys for admin data management.
export interface TabConfig {
  key: string;
  label: string;
  icon: string;
}

export interface ColumnConfig {
  key: string;
  label: string;
  type?: 'text' | 'enum' | 'number' | 'boolean' | 'relation';
  enumValues?: string[]; // For type='enum'
  relationEntity?: string; // For type='relation' - entity name to fetch
  relationLabel?: string; // For type='relation' - display label
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
    { key: 'recipe_id', label: 'ID', type: 'number' },
    { key: 'recipe_name', label: 'Nom', type: 'text' },
    { key: 'recipe_description', label: 'Description', type: 'text' },
    { 
      key: 'recipe_type', 
      label: 'Type', 
      type: 'enum',
      enumValues: ['breakfast', 'lunch', 'dinner', 'snack', 'dessert', 'pleasure', 'muscle_gain', 'weight_loss']
    },
    { 
      key: 'RecipeIngredients', 
      label: 'Ingrédients', 
      type: 'relation',
      relationEntity: 'recipes'
    },
  ],
  ingredients: [
    { key: 'ingredient_id', label: 'ID', type: 'number' },
    { key: 'ingredient_name', label: 'Nom', type: 'text' },
    { key: 'ingredient_type', label: 'Type', type: 'text' },
    { key: 'ingredient_energy_100g', label: 'kcal/100g', type: 'number' },
    { key: 'ingredient_protein_100g', label: 'Prot.', type: 'number' },
    { key: 'ingredient_carbohydrate_100g', label: 'Gluc.', type: 'number' },
    { key: 'ingredient_fats_100g', label: 'Lip.', type: 'number' },
  ],
  programs: [
    { key: 'sport_program_id', label: 'ID', type: 'number' },
    { key: 'sport_program_name', label: 'Nom', type: 'text' },
    { 
      key: 'sport_program_objective', 
      label: 'Objectif', 
      type: 'enum',
      enumValues: ['maintenance', 'weight_loss', 'muscle_gain', 'endurance', 'flexibility']
    },
    { key: 'sport_program_sessions', label: 'Séances (count)', type: 'number' },
    { key: 'sport_program_duration', label: 'Durée (j)', type: 'number' },
    { 
      key: 'sport_program_is_active', 
      label: 'Actif', 
      type: 'boolean'
    },
    { 
      key: 'programSessions', 
      label: 'Séances liées', 
      type: 'relation',
      relationEntity: 'programs'
    },
  ],
  sessions: [
    { key: 'sport_session_id', label: 'ID', type: 'number' },
    { key: 'sport_session_name', label: 'Nom', type: 'text' },
  ],
  exercises: [
    { key: 'sport_exercise_id', label: 'ID', type: 'number' },
    { key: 'sport_exercise_name', label: 'Nom', type: 'text' },
    { 
      key: 'sport_exercise_objective', 
      label: 'Objectif', 
      type: 'enum',
      enumValues: ['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'maintenance']
    },
    { 
      key: 'sport_exercise_difficulty', 
      label: 'Difficulté', 
      type: 'enum',
      enumValues: ['beginner', 'intermediate', 'advanced']
    },
    { 
      key: 'sport_exercise_muscle_group', 
      label: 'Muscle', 
      type: 'enum',
      enumValues: ['chest', 'back', 'shoulders', 'biceps', 'triceps', 'forearms', 'abs', 'glutes', 'quadriceps', 'hamstrings', 'calves', 'full_body']
    },
    { key: 'sport_exercise_cal_burned', label: 'kcal', type: 'number' },
  ],
  equipment: [
    { key: 'sport_equipment_id', label: 'ID', type: 'number' },
    { key: 'sport_equipment_name', label: 'Nom', type: 'text' },
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
