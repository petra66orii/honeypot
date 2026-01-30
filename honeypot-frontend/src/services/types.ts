export interface User {
  pk: number;
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

export interface UserProfile {
  username: string;
  email: string;
  first_name?: string;
  last_name?: string;
  // Note: NO 'default_' prefix here, matching your python model
  phone_number: string;
  street_address1: string;
  street_address2: string;
  town: string;
  county: string;
  postcode: string;
  country: string;
}

export interface AuthResponse {
  key: string; // The token
  user: User;  // The user details
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface Testimonial {
  id: number;
  name: string;
  text: string;
  rating: number;
}

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

export interface Review {
  id: number;
  user: string;
  rating: number;
  content: string; // or 'comment' depending on your Django model
  created_at: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface ProductFilters {
  category: string;
  search?: string;
  category__name?: string;
  ordering?: string;
  page: number;
}

// Define the response shape for Creating a Payment Intent
export interface PaymentIntentResponse {
  clientSecret: string;
  id: string;
}

// Request shape for items in the cart/payment intent
export interface CartItem {
  // Accept either backend naming "productId" or "id" to be flexible
  productId?: string;
  id?: string;
  quantity: number;
  // additional optional fields can be added as needed
}

// Define the response shape for Saving an Order
export interface SaveOrderResponse {
  success: boolean;
  order_number: string;
}

// Request shape for saving an order
export interface SaveOrderRequest {
  items: CartItem[];
  // add other order fields if required, e.g. shipping info, totals, etc.
}

export interface Order {
  order_number: string;
  date: string;
  total_price: number;
  status: string;
  items: Array<{ product_name: string; quantity: number }>;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image: string | null;
  created_at: string;
  post_type: 'blog' | 'recipe';
}

export interface BlogPostDetail extends BlogPost {
  content: string;
  author: string;
  comment_count: number;
}

export interface Comment {
  id: number;
  user: string;
  content: string;
  created_at: string;
  approved: boolean;
}