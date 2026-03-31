// Service: Api | Purpose: Handles shared business logic and API interactions.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = '/api';
  private readonly entityRouteMap: Record<string, string> = {
    recipes: 'recipes',
    ingredients: 'ingredients',
    programs: 'sport-programs',
    sessions: 'sport-sessions',
    exercises: 'sport-exercises',
    equipment: 'sport-equipment',
  };

  constructor(private http: HttpClient) {}

  // --- Auth ---
  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${this.base}/auth/login`, { email, password });
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.base}/auth/register`, data);
  }

  // --- Users ---
  createUser(data: any): Observable<any> {
    return this.http.post(`${this.base}/users`, data);
  }

  getUser(id: string): Observable<any> {
    return this.http.get(`${this.base}/users/${id}`);
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/users`);
  }

  updateUser(id: string, data: any): Observable<any> {
    return this.http.put(`${this.base}/users/${id}`, data);
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.base}/users/${id}`);
  }

  // --- Data lists ---
  getFood(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/ingredients`).pipe(
      map((ingredients) =>
        ingredients.map((ingredient) => ({
          ...ingredient,
          food_name: ingredient.ingredient_name,
          food_calories_per_100g: ingredient.ingredient_energy_100g,
          food_protein_per_100g: ingredient.ingredient_protein_100g,
          food_carbs_per_100g: ingredient.ingredient_carbohydrate_100g,
          food_fat_per_100g: ingredient.ingredient_fats_100g,
          food_allergens:
            Array.isArray(ingredient.allergies) && ingredient.allergies.length
              ? ingredient.allergies
                  .map((allergy: any) => allergy.ingredient_allergy_name)
                  .filter(Boolean)
                  .join(', ')
              : 'Aucun',
        })),
      ),
    );
  }

  getExercises(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/sport-exercises`).pipe(
      map((exercises) =>
        exercises.map((exercise) => ({
          ...exercise,
          exercise_name: exercise.sport_exercise_name,
          exercise_target_muscles: exercise.sport_exercise_muscle_group,
          exercise_instructions: exercise.sport_exercise_instruction,
          exercise_difficulty: exercise.sport_exercise_difficulty,
          equipment_id:
            Array.isArray(exercise.exerciseEquipments) && exercise.exerciseEquipments.length
              ? exercise.exerciseEquipments
                  .map((relation: any) => relation.sportEquipment?.sport_equipment_name)
                  .filter(Boolean)
                  .join(', ')
              : 'Aucun',
        })),
      ),
    );
  }

  getPrograms(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/sport-programs`);
  }

  getSessions(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/sport-sessions`);
  }

  getEquipment(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/sport-equipment`).pipe(
      map((equipment) =>
        equipment.map((item) => ({
          ...item,
          equipment_name: item.sport_equipment_name,
        })),
      ),
    );
  }

  // --- Detail endpoints ---
  getRecipes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/recipes`);
  }

  getRecipe(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/recipes/${id}`).pipe(
      map((recipe) => ({
        ...recipe,
        ingredients: Array.isArray(recipe.RecipeIngredients)
          ? recipe.RecipeIngredients.map((relation: any) => ({
              ingredient_id: relation.ingredient?.ingredient_id ?? relation.ingredient_id,
              ingredient_name: relation.ingredient?.ingredient_name ?? '',
              ingredient_type: relation.ingredient?.ingredient_type ?? '',
              ingredient_quantity: relation.ingredient_quantity,
              ingredient_energy_100g: relation.ingredient?.ingredient_energy_100g,
              ingredient_protein_100g: relation.ingredient?.ingredient_protein_100g,
              ingredient_carbohydrate_100g: relation.ingredient?.ingredient_carbohydrate_100g,
              ingredient_fats_100g: relation.ingredient?.ingredient_fats_100g,
            }))
          : [],
      })),
    );
  }

  getProgram(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/sport-programs/${id}`).pipe(
      map((program) => ({
        ...program,
        sessions: Array.isArray(program.programSessions)
          ? program.programSessions.map((relation: any) => ({
              sport_session_id: relation.sport_session?.sport_session_id ?? relation.sport_session_id,
              sport_session_name: relation.sport_session?.sport_session_name ?? '',
              rank: relation.program_sport_session_rank,
            }))
          : [],
      })),
    );
  }

  getSession(id: number): Observable<any> {
    return this.http.get<any>(`${this.base}/sport-sessions/${id}`).pipe(
      map((session) => {
        const exercises = Array.isArray(session.sessionExercises)
          ? session.sessionExercises.map((relation: any) => ({
              sport_exercise_id: relation.sportExercise?.sport_exercise_id ?? relation.sport_exercise_id,
              sport_exercise_name: relation.sportExercise?.sport_exercise_name ?? '',
              sport_exercise_muscle_group: relation.sportExercise?.sport_exercise_muscle_group ?? '',
              sport_exercise_difficulty: relation.sportExercise?.sport_exercise_difficulty ?? '',
              sport_exercise_duration: relation.sportExercise?.sport_exercise_duration,
              sport_exercise_cal_burned: relation.sportExercise?.sport_exercise_cal_burned,
              sport_exercise_instruction: relation.sportExercise?.sport_exercise_instruction,
              rank: relation.sport_session_exercise_rank,
              equipment: [],
            }))
          : [];

        return {
          ...session,
          exercises,
          all_equipment: [],
        };
      }),
    );
  }

  // --- Relation CRUD: Program <-> Session ---
  getAvailableSessionsForProgram(programId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/program-sessions/${programId}/available-sessions`);
  }

  addSessionToProgram(programId: number, sessionId: number, rank?: number): Observable<any> {
    return this.http.post(`${this.base}/program-sessions/${programId}/sessions`, {
      sessionId,
      ...(rank !== undefined ? { rank } : {}),
    });
  }

  removeSessionFromProgram(programId: number, sessionId: number): Observable<any> {
    return this.http.delete(`${this.base}/program-sessions/${programId}/sessions/${sessionId}`);
  }

  updateSessionRank(programId: number, sessionId: number, rank: number): Observable<any> {
    return this.http.put(`${this.base}/program-sessions/${programId}/sessions/${sessionId}`, { rank });
  }

  // --- Relation CRUD: Recipe <-> Ingredient ---
  getAvailableIngredientsForRecipe(recipeId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/recipe-ingredients/${recipeId}/available-ingredients`);
  }

  addIngredientToRecipe(recipeId: number, ingredientId: number, quantity: number): Observable<any> {
    return this.http.post(`${this.base}/recipe-ingredients/${recipeId}/ingredients`, {
      ingredientId,
      quantity,
    });
  }

  removeIngredientFromRecipe(recipeId: number, ingredientId: number): Observable<any> {
    return this.http.delete(`${this.base}/recipe-ingredients/${recipeId}/ingredients/${ingredientId}`);
  }

  updateIngredientQuantity(recipeId: number, ingredientId: number, quantity: number): Observable<any> {
    return this.http.put(`${this.base}/recipe-ingredients/${recipeId}/ingredients/${ingredientId}`, {
      quantity,
    });
  }

  // --- Relation CRUD: Session <-> Exercise ---
  getAvailableExercisesForSession(sessionId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/session-exercises/${sessionId}/available-exercises`);
  }

  addExerciseToSession(sessionId: number, exerciseId: number, rank?: number): Observable<any> {
    return this.http.post(`${this.base}/session-exercises/${sessionId}/exercises`, {
      exerciseId,
      ...(rank !== undefined ? { rank } : {}),
    });
  }

  removeExerciseFromSession(sessionId: number, exerciseId: number): Observable<any> {
    return this.http.delete(`${this.base}/session-exercises/${sessionId}/exercises/${exerciseId}`);
  }

  updateExerciseRankInSession(sessionId: number, exerciseId: number, rank: number): Observable<any> {
    return this.http.put(`${this.base}/session-exercises/${sessionId}/exercises/${exerciseId}`, { rank });
  }

  // --- Admin CRUD ---
  createItem(entity: string, data: any): Observable<any> {
    return this.http.post(`${this.base}/${this.resolveEntityRoute(entity)}`, data);
  }

  updateItem(entity: string, id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/${this.resolveEntityRoute(entity)}/${id}`, data);
  }

  deleteItem(entity: string, id: number): Observable<any> {
    return this.http.delete(`${this.base}/${this.resolveEntityRoute(entity)}/${id}`);
  }

  private resolveEntityRoute(entity: string): string {
    return this.entityRouteMap[entity] ?? entity;
  }
}
