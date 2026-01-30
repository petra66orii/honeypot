import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, Category } from './types'; 

export interface ProductFilters {
  search?: string;
  category__name?: string;
  ordering?: string;
}

// Define the response shape for Creating a Payment Intent
interface PaymentIntentResponse {
  clientSecret: string;
  id: string;
}

// Request shape for items in the cart/payment intent
interface CartItem {
  // Accept either backend naming "productId" or "id" to be flexible
  productId?: string;
  id?: string;
  quantity: number;
  // additional optional fields can be added as needed
}

// Define the response shape for Saving an Order
interface SaveOrderResponse {
  success: boolean;
  order_number: string;
}

// Request shape for saving an order
interface SaveOrderRequest {
  items: CartItem[];
  // add other order fields if required, e.g. shipping info, totals, etc.
}

export const honeypotApi = createApi({
  reducerPath: 'honeypotApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], ProductFilters>({
      query: (params) => ({
        url: 'products/',
        params: params,
      }),
      transformResponse: (response: { results: Product[] }) => response.results,
    }),
    getCategories: builder.query<Category[], void>({
      query: () => 'categories/',
      transformResponse: (response: { results: Category[] }) => response.results,
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `products/${id}/`,
    }),
    getRelatedProducts: builder.query<Product[], string>({
      query: (id) => `products/${id}/related/`,
      transformResponse: (response: { results: Product[] }) => response.results,
    }),
    
    // --- CHECKOUT ENDPOINTS ---

    // 1. Create Payment Intent
    // Accept a typed array of cart items
    createPaymentIntent: builder.mutation<PaymentIntentResponse, { items: CartItem[] }>({
        query: (cartData) => ({
            url: 'checkout/create-payment-intent/',
            method: 'POST',
            body: cartData,
        }),
    }),

    // 2. Save Order
    saveOrder: builder.mutation<SaveOrderResponse, SaveOrderRequest>({
        query: (orderData) => ({
            url: 'checkout/save-order/',
            method: 'POST',
            body: orderData,
        }),
    }),
  }),
});

export const { 
    useGetProductsQuery, 
    useGetCategoriesQuery, 
    useGetProductQuery, 
    useGetRelatedProductsQuery,
    useCreatePaymentIntentMutation,
    useSaveOrderMutation 
} = honeypotApi;