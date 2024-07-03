import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { Stripe, loadStripe } from '@stripe/stripe-js';
import { Product } from '../_models/model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class StripeService {
  private readonly API_END_POINT: string = environment.API_END_POINT;
  private readonly STRIPE_PUBLISHABLE_KEY: string =
    environment.STRIPE_PUBLISHABLE_KEY;
  private stripePromise: Promise<Stripe | null>;
  private http = inject(HttpClient);

  constructor() {
    this.stripePromise = loadStripe(this.STRIPE_PUBLISHABLE_KEY);
  }

  getStripe() {
    return this.stripePromise;
  }

  buySingleProduct(product: Product) {
    return this.http.post(`${this.API_END_POINT}/checkout`, {
      product,
      isPremium: false,
    });
  }

  createSubscription(userId: string = 'user1') {
    return this.http.post(this.API_END_POINT + '/create-subscription', {
      userId,
    });
  }
  cancelSubscription(userId: string = 'user1') {
    return this.http.post(this.API_END_POINT + '/cancel-subscription', {
      userId,
    });
  }
}
