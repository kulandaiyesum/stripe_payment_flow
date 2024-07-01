import { Component, OnInit, inject } from '@angular/core';
import { ProductService } from '../_services/product.service';
import { Product } from '../_models/model';
import { CurrencyPipe } from '@angular/common';
import { map } from 'rxjs';
import { StripeService } from '../_services/stripe.service';
import { Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-one-time',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './one-time.component.html',
})
export class OneTimeComponent implements OnInit {
  private productService: ProductService = inject(ProductService);
  private stripeService: StripeService = inject(StripeService);
  products: Product[] = [];
  stripe: Stripe | null = null;
  ngOnInit(): void {
    this.productService.getProducts().subscribe((products) => {
      console.log(products);
      this.products = products as Product[];
    });
    this.stripeService.getStripe().then((stripe) => {
      if (stripe) {
        this.stripe = stripe;
      }
    });
  }

  buyNow(product: Product) {
    console.log(product);
    this.stripeService.buySingleProduct(product).subscribe((res: any) => {
      console.log('res is ', res);
      this.stripe?.redirectToCheckout({
        sessionId: res.id,
      });
    });
  }
}
