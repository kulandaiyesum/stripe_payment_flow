export interface Rating {
  rate: number;
  count: number;
}

export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: Rating;
}
export interface Subscription {
  title: string;
  description: string;
  price: number;
  interval: string;
  features: string[];
}
