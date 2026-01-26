import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, Category } from './types';

// 1. Define the shape of our filter parameters
export interface ProductFilters {
  search?: string;
  category__name?: string;
  ordering?: string;
}

export const honeypotApi = createApi({
  reducerPath: 'honeypotApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://127.0.0.1:8000/api/' }),
  endpoints: (builder) => ({
    // 2. Updated getProducts to accept filters AND unwrap the paginated response
    getProducts: builder.query<Product[], ProductFilters>({
      query: (params) => ({
        url: 'products/',
        params: params,
      }),
      transformResponse: (response: { results: Product[] }) => response.results,
    }),

    getProduct: builder.query<Product, string>({
      query: (id) => `products/${id}/`,
    }),

    getRelatedProducts: builder.query<Product[], string>({
      query: (id) => `products/${id}/related/`,
      transformResponse: (response: { results: Product[] }) => response.results,
    }),
    
    // 3. New endpoint to fetch categories for the dropdown
getCategories: builder.query<Category[], void>({
      query: () => 'categories/',
      transformResponse: (response: { results: Category[] }) => response.results,
    }),
  }),
});

export const { 
  useGetProductsQuery, 
  useGetCategoriesQuery, 
  useGetProductQuery,       
  useGetRelatedProductsQuery
} = honeypotApi;