import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('maps ingredient rows into food records', () => {
    let result: any[] | undefined;

    service.getFood().subscribe((value) => {
      result = value;
    });

    const request = httpMock.expectOne('/api/ingredients');
    expect(request.request.method).toBe('GET');

    request.flush([
      {
        ingredient_name: 'Poulet',
        ingredient_energy_100g: 165,
        ingredient_protein_100g: 31,
        ingredient_carbohydrate_100g: 0,
        ingredient_fats_100g: 3.6,
        allergies: [
          { ingredient_allergy_name: 'Poisson' },
          { ingredient_allergy_name: null },
        ],
      },
    ]);

    expect(result).toEqual([
      {
        ingredient_name: 'Poulet',
        ingredient_energy_100g: 165,
        ingredient_protein_100g: 31,
        ingredient_carbohydrate_100g: 0,
        ingredient_fats_100g: 3.6,
        allergies: [
          { ingredient_allergy_name: 'Poisson' },
          { ingredient_allergy_name: null },
        ],
        food_name: 'Poulet',
        food_calories_per_100g: 165,
        food_protein_per_100g: 31,
        food_carbs_per_100g: 0,
        food_fat_per_100g: 3.6,
        food_allergens: 'Poisson',
      },
    ]);
  });

  it('normalizes recipe ingredient relations', () => {
    let result: any;

    service.getRecipe(42).subscribe((value) => {
      result = value;
    });

    const request = httpMock.expectOne('/api/recipes/42');
    expect(request.request.method).toBe('GET');

    request.flush({
      recipe_id: 42,
      RecipeIngredients: [
        {
          ingredient_id: 7,
          ingredient_quantity: 120,
          ingredient: {
            ingredient_name: 'Avoine',
            ingredient_type: 'cereal',
            ingredient_energy_100g: 389,
            ingredient_protein_100g: 16.9,
            ingredient_carbohydrate_100g: 66.3,
            ingredient_fats_100g: 6.9,
          },
        },
      ],
    });

    expect(result.ingredients).toEqual([
      {
        ingredient_id: 7,
        ingredient_name: 'Avoine',
        ingredient_type: 'cereal',
        ingredient_quantity: 120,
        ingredient_energy_100g: 389,
        ingredient_protein_100g: 16.9,
        ingredient_carbohydrate_100g: 66.3,
        ingredient_fats_100g: 6.9,
      },
    ]);
  });
});