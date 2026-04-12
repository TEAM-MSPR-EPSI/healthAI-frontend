import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EtlNutritionService {

  private baseUrl = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  extractIngredients(): Observable<any> {
    return this.http.post(`${this.baseUrl}/etl/extract-transform/ingredient`, {});
  }

}