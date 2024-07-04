import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map } from 'rxjs';
import { Product } from '../_models/model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = 'https://fakestoreapi.com/products';
  private http = inject(HttpClient);
  constructor() {}

  getProducts() {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map((products: Product[]) =>
        products.map((product) => ({
          ...product,
          price: product.price * 80,
        }))
      )
    );
  }
}
