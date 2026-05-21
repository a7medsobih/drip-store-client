import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { CategoriesService } from '@dashboard/services/categories.service';
import { ProductsService } from '@dashboard/services/products.service';
import { Products } from './products';

describe('Products', () => {
  let component: Products;
  let fixture: ComponentFixture<Products>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Products],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            getProducts: () =>
              of({
                success: true,
                message: 'ok',
                data: {
                  items: [],
                  pagination: { page: 1, limit: 20, total: 0, totalPages: 1 },
                },
              }),
          },
        },
        {
          provide: CategoriesService,
          useValue: {
            getCategories: () => of([]),
            getSubcategories: () => of([]),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Products);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
