// src/app/core/services/product.service.ts
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { environment } from "../../../environments/env-development";
import { IProductsRes } from "@core/models/product.model";

@Injectable({
    providedIn: 'root',
})
export class ProductService {
    constructor(private _http: HttpClient) { }

    private apiURL = environment.apiURL + "/products";

    getProducts() {
        console.log('API:', this.apiURL);
        return this._http.get<IProductsRes>(this.apiURL);
    }
}
