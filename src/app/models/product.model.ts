export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  image: string;
  skinTypes: string[];
  description: string;
  rating: number;
  badge: string;
  inStock: boolean;
  goal: string;
}
