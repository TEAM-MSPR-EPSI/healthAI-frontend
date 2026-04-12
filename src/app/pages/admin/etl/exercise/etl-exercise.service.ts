import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtlExerciseService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  extractExercises(): Observable<any> {
    return this.http.post(`${this.baseUrl}/etl/extract-transform/exercise`, {});
  }

  getExerciseData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/csv/exercise`);
  }

  saveExerciseData(data: any[]): Observable<any> {
  return this.http.put(`${this.baseUrl}/csv/exercise`, { data });
  }
}