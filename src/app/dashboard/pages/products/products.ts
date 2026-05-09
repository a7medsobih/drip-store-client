// src/app/dashboard/pages/products/products.ts
import { Component, OnInit } from '@angular/core';

import { IProduct } from '@core/models/product.model';
import { ProductService } from '@core/services/product.service';

@Component({
  selector: 'app-products',
  imports: [],
  templateUrl: './products.html',
  styleUrl: './products.css',
})
export class Products implements OnInit {

  myProducts: IProduct[] = [];

  constructor(private _productService: ProductService) { }

  ngOnInit(): void {
    this._productService.getProducts().subscribe(
      {
        next: (res) => {
          console.log('SUCCESS:', res);
          this.myProducts = res.data;
        },
      }
    );
  }
}
