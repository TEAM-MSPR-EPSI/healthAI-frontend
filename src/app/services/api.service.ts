// Service: Api | Purpose: Handles shared business logic and API interactions.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import {
  FALLBACK_EQUIPMENT,
  FALLBACK_EXERCISES,
  FALLBACK_FOOD,
  FALLBACK_PROGRAMS,
  FALLBACK_PROGRAM_DETAILS,
  FALLBACK_RECIPES,
  FALLBACK_RECIPE_DETAILS,
  FALLBACK_SESSIONS,
  FALLBACK_SESSION_DETAILS,
} from './api-fallback.data';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly base = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // --- Auth ---
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.base}/users/login`, { email, password });
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
    return this.withFallback(
      this.http.get<any[]>(`${this.base}/data/food`),
      FALLBACK_FOOD,
      '/data/food',
    );
  }

  getExercises(): Observable<any[]> {
    return this.withFallback(
      this.http.get<any[]>(`${this.base}/data/exercises`),
      FALLBACK_EXERCISES,
      '/data/exercises',
    );
  }

  getPrograms(): Observable<any[]> {
    return this.withFallback(
      this.http.get<any[]>(`${this.base}/data/programs`),
      FALLBACK_PROGRAMS,
      '/data/programs',
    );
  }

  getSessions(): Observable<any[]> {
    return this.withFallback(
      this.http.get<any[]>(`${this.base}/data/sessions`),
      FALLBACK_SESSIONS,
      '/data/sessions',
    );
  }

  getEquipment(): Observable<any[]> {
    return this.withFallback(
      this.http.get<any[]>(`${this.base}/data/equipment`),
      FALLBACK_EQUIPMENT,
      '/data/equipment',
    );
  }

  // --- Detail endpoints ---
  getRecipes(): Observable<any[]> {
    return this.withFallback(
      this.http.get<any[]>(`${this.base}/data/recipes`),
      FALLBACK_RECIPES,
      '/data/recipes',
    );
  }

  getRecipe(id: number): Observable<any> {
    return this.withFallback(
      this.http.get(`${this.base}/data/recipes/${id}`),
      this.findById(FALLBACK_RECIPE_DETAILS, 'recipe_id', id),
      `/data/recipes/${id}`,
    );
  }

  getProgram(id: number): Observable<any> {
    return this.withFallback(
      this.http.get(`${this.base}/data/programs/${id}`),
      this.findById(FALLBACK_PROGRAM_DETAILS, 'sport_program_id', id),
      `/data/programs/${id}`,
    );
  }

  getSession(id: number): Observable<any> {
    return this.withFallback(
      this.http.get(`${this.base}/data/sessions/${id}`),
      this.findById(FALLBACK_SESSION_DETAILS, 'sport_session_id', id),
      `/data/sessions/${id}`,
    );
  }

  // --- Admin CRUD ---
  createItem(entity: string, data: any): Observable<any> {
    return this.http.post(`${this.base}/data/${entity}`, data);
  }

  updateItem(entity: string, id: number, data: any): Observable<any> {
    return this.http.put(`${this.base}/data/${entity}/${id}`, data);
  }

  deleteItem(entity: string, id: number): Observable<any> {
    return this.http.delete(`${this.base}/data/${entity}/${id}`);
  }

  private withFallback<T>(request: Observable<T>, fallbackData: T, routeLabel: string): Observable<T> {
    return request.pipe(
      catchError((error) => {
        console.warn(`[ApiService] Falling back to example data for ${routeLabel}.`, error);
        return of(this.cloneData(fallbackData));
      }),
    );
  }

  private findById<T extends Record<string, any>>(items: T[], idKey: keyof T, id: number): T {
    return items.find((item) => Number(item[idKey]) === id) ?? items[0];
  }

  private cloneData<T>(data: T): T {
    if (typeof structuredClone === 'function') {
      return structuredClone(data);
    }

    return JSON.parse(JSON.stringify(data)) as T;
  }
}
