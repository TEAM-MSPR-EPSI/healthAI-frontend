// Config: ApiFallbackData | Purpose: Provides temporary example datasets when API routes are unavailable.
export const FALLBACK_RECIPES = [
  {
    recipe_id: 1,
    recipe_name: 'Bowl poulet quinoa',
    recipe_description: 'Bol complet riche en proteines avec quinoa, poulet grille et legumes croquants.',
    recipe_preparation: 'Cuire le quinoa. Griller le poulet. Ajouter les legumes et assaisonner avant de servir.',
    recipe_type: 'muscle_gain',
  },
  {
    recipe_id: 2,
    recipe_name: 'Salade fraicheur saumon',
    recipe_description: 'Salade equilibree avec saumon, avocat et concombre.',
    recipe_preparation: 'Disposer la salade, ajouter le saumon et l avocat puis terminer avec une vinaigrette legere.',
    recipe_type: 'lunch',
  },
  {
    recipe_id: 3,
    recipe_name: 'Porridge banane amandes',
    recipe_description: 'Petit-dejeuner simple, rassasiant et rapide a preparer.',
    recipe_preparation: 'Cuire les flocons d avoine dans du lait, ajouter la banane et parsemer d amandes.',
    recipe_type: 'breakfast',
  },
];

export const FALLBACK_FOOD = [
  {
    ingredient_id: 1,
    ingredient_name: 'Blanc de poulet',
    ingredient_type: 'meat',
    ingredient_energy_100g: 165,
    ingredient_protein_100g: 31,
    ingredient_carbohydrate_100g: 0,
    ingredient_fats_100g: 3.6,
    food_name: 'Blanc de poulet',
    food_calories_per_100g: 165,
    food_protein_per_100g: 31,
    food_carbs_per_100g: 0,
    food_fat_per_100g: 3.6,
    food_allergens: 'Aucun',
  },
  {
    ingredient_id: 2,
    ingredient_name: 'Quinoa',
    ingredient_type: 'grain',
    ingredient_energy_100g: 120,
    ingredient_protein_100g: 4.4,
    ingredient_carbohydrate_100g: 21.3,
    ingredient_fats_100g: 1.9,
    food_name: 'Quinoa',
    food_calories_per_100g: 120,
    food_protein_per_100g: 4.4,
    food_carbs_per_100g: 21.3,
    food_fat_per_100g: 1.9,
    food_allergens: 'Sans gluten',
  },
  {
    ingredient_id: 3,
    ingredient_name: 'Avocat',
    ingredient_type: 'fruit',
    ingredient_energy_100g: 160,
    ingredient_protein_100g: 2,
    ingredient_carbohydrate_100g: 8.5,
    ingredient_fats_100g: 14.7,
    food_name: 'Avocat',
    food_calories_per_100g: 160,
    food_protein_per_100g: 2,
    food_carbs_per_100g: 8.5,
    food_fat_per_100g: 14.7,
    food_allergens: 'Aucun',
  },
];

export const FALLBACK_EXERCISES = [
  {
    sport_exercise_id: 1,
    sport_exercise_name: 'Squat goblet',
    sport_exercise_objective: 'muscle_gain',
    sport_exercise_difficulty: 'beginner',
    sport_exercise_duration: 12,
    sport_exercise_muscle_group: 'quadriceps',
    sport_exercise_instruction: 'Tenir la charge contre le buste, descendre en gardant le dos neutre puis remonter.',
    sport_exercise_cal_burned: 95,
    exercise_name: 'Squat goblet',
    exercise_target_muscles: 'quadriceps',
    exercise_instructions: 'Tenir la charge contre le buste, descendre en gardant le dos neutre puis remonter.',
    exercise_difficulty: 'beginner',
    equipment_id: 'Kettlebell',
  },
  {
    sport_exercise_id: 2,
    sport_exercise_name: 'Pompes',
    sport_exercise_objective: 'maintenance',
    sport_exercise_difficulty: 'beginner',
    sport_exercise_duration: 10,
    sport_exercise_muscle_group: 'chest',
    sport_exercise_instruction: 'Garder le corps aligne et descendre de facon controlee.',
    sport_exercise_cal_burned: 70,
    exercise_name: 'Pompes',
    exercise_target_muscles: 'chest',
    exercise_instructions: 'Garder le corps aligne et descendre de facon controlee.',
    exercise_difficulty: 'beginner',
    equipment_id: 'Aucun',
  },
  {
    sport_exercise_id: 3,
    sport_exercise_name: 'Rowing elastique',
    sport_exercise_objective: 'endurance',
    sport_exercise_difficulty: 'intermediate',
    sport_exercise_duration: 15,
    sport_exercise_muscle_group: 'back',
    sport_exercise_instruction: 'Tirer les coudes vers l arriere en gardant les epaules basses.',
    sport_exercise_cal_burned: 85,
    exercise_name: 'Rowing elastique',
    exercise_target_muscles: 'back',
    exercise_instructions: 'Tirer les coudes vers l arriere en gardant les epaules basses.',
    exercise_difficulty: 'intermediate',
    equipment_id: 'Elastique',
  },
];

export const FALLBACK_PROGRAMS = [
  {
    sport_program_id: 1,
    sport_program_name: 'Remise en forme 4 semaines',
    sport_program_objective: 'maintenance',
    sport_program_sessions: 12,
    sport_program_duration: 28,
  },
  {
    sport_program_id: 2,
    sport_program_name: 'Perte de poids active',
    sport_program_objective: 'weight_loss',
    sport_program_sessions: 16,
    sport_program_duration: 35,
  },
  {
    sport_program_id: 3,
    sport_program_name: 'Prise de masse debutant',
    sport_program_objective: 'muscle_gain',
    sport_program_sessions: 18,
    sport_program_duration: 42,
  },
];

export const FALLBACK_SESSIONS = [
  {
    sport_session_id: 1,
    sport_session_name: 'Bas du corps dynamique',
    sport_program_name: 'Remise en forme 4 semaines',
  },
  {
    sport_session_id: 2,
    sport_session_name: 'Cardio metabolique',
    sport_program_name: 'Perte de poids active',
  },
  {
    sport_session_id: 3,
    sport_session_name: 'Haut du corps force',
    sport_program_name: 'Prise de masse debutant',
  },
];

export const FALLBACK_EQUIPMENT = [
  {
    sport_equipment_id: 1,
    sport_equipment_name: 'Kettlebell 12 kg',
    equipment_name: 'Kettlebell 12 kg',
  },
  {
    sport_equipment_id: 2,
    sport_equipment_name: 'Tapis de sol',
    equipment_name: 'Tapis de sol',
  },
  {
    sport_equipment_id: 3,
    sport_equipment_name: 'Elastique de resistance',
    equipment_name: 'Elastique de resistance',
  },
];

export const FALLBACK_RECIPE_DETAILS = [
  {
    recipe_id: 1,
    recipe_name: 'Bowl poulet quinoa',
    recipe_description: 'Recette complete pour un dejeuner riche en proteines.',
    recipe_preparation: 'Cuire quinoa et poulet separement. Ajouter avocat, tomates et une sauce yaourt citron.',
    recipe_type: 'muscle_gain',
    ingredients: [
      {
        ingredient_id: 1,
        ingredient_name: 'Blanc de poulet',
        ingredient_type: 'meat',
        ingredient_quantity: 150,
        ingredient_energy_100g: 165,
        ingredient_protein_100g: 31,
        ingredient_carbohydrate_100g: 0,
        ingredient_fats_100g: 3.6,
      },
      {
        ingredient_id: 2,
        ingredient_name: 'Quinoa',
        ingredient_type: 'grain',
        ingredient_quantity: 120,
        ingredient_energy_100g: 120,
        ingredient_protein_100g: 4.4,
        ingredient_carbohydrate_100g: 21.3,
        ingredient_fats_100g: 1.9,
      },
    ],
  },
  {
    recipe_id: 2,
    recipe_name: 'Salade fraicheur saumon',
    recipe_description: 'Salade simple et legere pour le midi.',
    recipe_preparation: 'Couper les legumes, ajouter le saumon et une vinaigrette moutarde citron.',
    recipe_type: 'lunch',
    ingredients: [
      {
        ingredient_id: 3,
        ingredient_name: 'Avocat',
        ingredient_type: 'fruit',
        ingredient_quantity: 80,
        ingredient_energy_100g: 160,
        ingredient_protein_100g: 2,
        ingredient_carbohydrate_100g: 8.5,
        ingredient_fats_100g: 14.7,
      },
    ],
  },
];

export const FALLBACK_PROGRAM_DETAILS = [
  {
    sport_program_id: 1,
    sport_program_name: 'Remise en forme 4 semaines',
    sport_program_objective: 'maintenance',
    sport_program_duration: 28,
    sport_program_sessions: 12,
    sessions: [
      { sport_session_id: 1, sport_session_name: 'Bas du corps dynamique', rank: 1 },
      { sport_session_id: 2, sport_session_name: 'Cardio metabolique', rank: 2 },
    ],
  },
  {
    sport_program_id: 2,
    sport_program_name: 'Perte de poids active',
    sport_program_objective: 'weight_loss',
    sport_program_duration: 35,
    sport_program_sessions: 16,
    sessions: [
      { sport_session_id: 2, sport_session_name: 'Cardio metabolique', rank: 1 },
      { sport_session_id: 1, sport_session_name: 'Bas du corps dynamique', rank: 2 },
    ],
  },
];

export const FALLBACK_SESSION_DETAILS = [
  {
    sport_session_id: 1,
    sport_session_name: 'Bas du corps dynamique',
    exercises: [
      {
        sport_exercise_id: 1,
        sport_exercise_name: 'Squat goblet',
        sport_exercise_muscle_group: 'quadriceps',
        sport_exercise_difficulty: 'beginner',
        sport_exercise_duration: 12,
        sport_exercise_cal_burned: 95,
        sport_exercise_instruction: 'Tenir la charge proche du buste et garder les genoux alignes.',
        rank: 1,
        equipment: [{ sport_equipment_id: 1, sport_equipment_name: 'Kettlebell 12 kg' }],
      },
      {
        sport_exercise_id: 2,
        sport_exercise_name: 'Pompes',
        sport_exercise_muscle_group: 'chest',
        sport_exercise_difficulty: 'beginner',
        sport_exercise_duration: 10,
        sport_exercise_cal_burned: 70,
        sport_exercise_instruction: 'Garder le corps aligne du debut a la fin du mouvement.',
        rank: 2,
        equipment: [],
      },
    ],
    all_equipment: [{ sport_equipment_id: 1, sport_equipment_name: 'Kettlebell 12 kg' }],
  },
  {
    sport_session_id: 2,
    sport_session_name: 'Cardio metabolique',
    exercises: [
      {
        sport_exercise_id: 3,
        sport_exercise_name: 'Rowing elastique',
        sport_exercise_muscle_group: 'back',
        sport_exercise_difficulty: 'intermediate',
        sport_exercise_duration: 15,
        sport_exercise_cal_burned: 85,
        sport_exercise_instruction: 'Controler le retour et garder la poitrine ouverte.',
        rank: 1,
        equipment: [{ sport_equipment_id: 3, sport_equipment_name: 'Elastique de resistance' }],
      },
    ],
    all_equipment: [{ sport_equipment_id: 3, sport_equipment_name: 'Elastique de resistance' }],
  },
];