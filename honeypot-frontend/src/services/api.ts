import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, Category, ProductFilters, PaymentIntentResponse, CartItem, SaveOrderResponse, SaveOrderRequest, Review } from './types'; 

export const honeypotApi = createApi({
  reducerPath: 'honeypotApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
  
  tagTypes: ['Reviews'], 

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

    // --- REVIEW ENDPOINTS ---

    // 3. Get Reviews
    getReviews: builder.query<Review[], string>({
      query: (productId) => `products/${productId}/reviews/`,
      providesTags: ['Reviews'], // This tells Redux "This list depends on the 'Reviews' tag"
    }),

    // 4. Add Review
    addReview: builder.mutation<{ message: string }, { productId: string; rating: number; content: string }>({
      query: ({ productId, ...body }) => ({
        url: `products/${productId}/reviews/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reviews'], // This tells Redux "I changed 'Reviews', please re-fetch the list!"
    }),

  }),
});

export const { 
    useGetProductsQuery, 
    useGetCategoriesQuery, 
    useGetProductQuery, 
    useGetRelatedProductsQuery,
    useCreatePaymentIntentMutation,
    useSaveOrderMutation,
    useGetReviewsQuery,
    useAddReviewMutation
} = honeypotApi;