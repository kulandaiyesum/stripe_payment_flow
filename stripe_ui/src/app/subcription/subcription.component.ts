import { CurrencyPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Subscription } from '../_models/model';

@Component({
  selector: 'app-subcription',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './subcription.component.html',
})
export class SubcriptionComponent {
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

  activeSubcription(item: Subscription) {
    console.log(item);
  }
}
