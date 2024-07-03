import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Subscription } from '../_models/model';
import { StripeService } from '../_services/stripe.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Stripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-subcription',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './subcription.component.html',
})
export class SubcriptionComponent implements OnInit {
  private stripeService = inject(StripeService);
  stripe: Stripe | null = null;
  subscriptios: Subscription[] = [
    {
      title: 'starter',
      description: 'Best option for personal use & for your next project.',
      price: 99,
      interval: 'month',
      features: [
        'Individual configuration',
        'No setup, or hidden fees',
        'Team size: <span class="font-semibold">1 developer</span>',
        'Premium support: <span class="font-semibold">6 months</span>',
        'Free updates: <span class="font-semibold">6 months</span>',
      ],
    },
    {
      title: 'Company',
      description: 'Relevant for multiple users, extended & premium support.',
      price: 499,
      interval: 'month',
      features: [
        'Individual configuration',
        'No setup, or hidden fees',
        'Team size: <span class="font-semibold">10 developer</span>',
        'Premium support: <span class="font-semibold">24 months</span>',
        'Free updates: <span class="font-semibold">24 months</span>',
      ],
    },
    {
      title: 'Enterprise',
      description:
        'Best for large scale uses and extended redistribution rights.',
      price: 999,
      interval: 'month',
      features: [
        'Individual configuration',
        'No setup, or hidden fees',
        'Team size: <span class="font-semibold">100+ developer</span>',
        'Premium support: <span class="font-semibold">36 months</span>',
        'Free updates: <span class="font-semibold">36 months</span>',
      ],
    },
  ];

  ngOnInit(): void {
    this.stripeService.getStripe().then((stripe) => {
      if (stripe) {
        this.stripe = stripe;
      }
    });
  }

  activeSubcription(item: Subscription) {
    console.log(item);
    this.stripeService.createSubscription().subscribe({
      next: (res: any) => {},
      error: (err: any) => {},
    });
  }

  createSubscription() {
    this.stripeService.createSubscription().subscribe({
      next: (res: any) => {
        console.log('subscription response is ', res);
        this.stripe?.redirectToCheckout({
          sessionId: res.id,
        });
      },
      error: (err: HttpErrorResponse) => {
        console.log('subscription error is ', err);
        // if(err.status === 409) {
        //   const redirectUrl = err.error?.data?.redirectUrl
        //   window.location.href = redirectUrl
        // }
      },
    });
  }
  cancelSubcription() {
    this.stripeService.cancelSubscription().subscribe({
      next: (res: any) => {
        console.log('sub cancel is', res);
      },
      error: (err: any) => {
        console.log('sub error is', err);
      },
    });
  }
}
