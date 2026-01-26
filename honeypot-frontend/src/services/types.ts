export interface Category {
  id: number;
  name: string;
  friendly_name: string;
}

export interface Product {
  id: number;
  category: Category;
  sku: string;
  name: string;
  description: string;
  price: string; // Decimals come over as strings from Django
  rating: number | null;
  image: string | null;
  average_rating: number;
  full_bees: number;
  has_half_bee: boolean;
}