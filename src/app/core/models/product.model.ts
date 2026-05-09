// src/app/core/models/product.model.ts
export interface IProduct {
    _id: string;
    name: string;
    desc: string;
    imgURL: string;
    price: number;
    stock: number;
    slug: string;
}

export interface IProductsRes {
    message: string;
    data: IProduct[];
}
