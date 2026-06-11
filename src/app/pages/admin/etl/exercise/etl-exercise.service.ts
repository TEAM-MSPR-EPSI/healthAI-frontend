import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtlExerciseService {

  private baseUrl = '/etl';

  constructor(private http: HttpClient) {}

  extractExercises(): Observable<any> {
    return this.http.post(`${this.baseUrl}/extract-transform/exercise`, {});
  }

  getExerciseData(): Observable<any> {
    return this.http.get('/csv/exercise');
  }

  saveExerciseData(data: any[]): Observable<any> {
  return this.http.put('/csv/exercise', { data });
  }

  loadExercisesToDb(): Observable<any> {
  return this.http.post(`${this.baseUrl}/load-to-db/exercise`, {});
  }
}