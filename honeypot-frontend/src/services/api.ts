import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, Category, ProductFilters, PaymentIntentResponse, CartItem, SaveOrderResponse, SaveOrderRequest, Review, AuthResponse, User, Order, UserProfile, BlogPost, BlogPostDetail, Comment, RegisterRequest, LoginRequest, Testimonial, PaginatedResponse, } from './types'; 

export const honeypotApi = createApi({
  reducerPath: 'honeypotApi',
baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://127.0.0.1:8000/api/',
    prepareHeaders: (headers, { getState }) => {
      // 1. Get the token from the Redux store
      // (Use a narrow typed state shape to avoid 'any' and circular deps)
      const state = getState() as { auth?: { token?: string | null } };
      const token = state?.auth?.token;
      
      // 2. If a token exists, attach it to the headers
      if (token) {
        headers.set('authorization', `Token ${token}`);
      }
      
      return headers;
    },
  }),  
  tagTypes: ['Reviews', 'Profile', 'Comments'], 

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

    // Create Payment Intent
    createPaymentIntent: builder.mutation<PaymentIntentResponse, { items: CartItem[] }>({
        query: (cartData) => ({
            url: 'checkout/create-payment-intent/',
            method: 'POST',
            body: cartData,
        }),
    }),

    // Save Order
    saveOrder: builder.mutation<SaveOrderResponse, SaveOrderRequest>({
        query: (orderData) => ({
            url: 'checkout/save-order/',
            method: 'POST',
            body: orderData,
        }),
    }),

    // --- REVIEW ENDPOINTS ---

    // Reviews
    getReviews: builder.query<Review[], string>({
      query: (productId) => `products/${productId}/reviews/`,
      providesTags: ['Reviews'], // This tells Redux "This list depends on the 'Reviews' tag"
    }),

    // Add Review
    addReview: builder.mutation<{ message: string }, { productId: string; rating: number; content: string }>({
      query: ({ productId, ...body }) => ({
        url: `products/${productId}/reviews/`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Reviews'], // This tells Redux "I changed 'Reviews', please re-fetch the list!"
    }),

    // --- AUTHENTICATION ENDPOINTS ---

    // Login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login/',
        method: 'POST',
        body: credentials,
      }),
    }),

    getUser: builder.query<User, void>({
      query: () => 'auth/user/',
    }),
    
    // Register
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: 'auth/registration/',
        method: 'POST',
        body: userData,
      }),
    }),
    
    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout/',
        method: 'POST',
      }),
    }),

    // Order History
    getMyOrders: builder.query<Order[], void>({
        query: () => 'checkout/orders/',
        transformResponse: (response: { results: Order[] }) => response.results,
    }),

    // GET PROFILE
    getUserProfile: builder.query<UserProfile, void>({
      query: () => 'profiles/',
      providesTags: ['Profile'], // Tag for auto-refreshing
    }),

    // UPDATE PROFILE
    updateUserProfile: builder.mutation<UserProfile, Partial<UserProfile>>({
      query: (data) => ({
        url: 'profiles/',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Profile'], // Refresh data after update
    }),

    // --- BLOG ENDPOINTS ---

// --- BLOG ENDPOINTS ---

    // Get all posts
    // Resulting URL: /api/blog/posts/
    getBlogPosts: builder.query<BlogPost[], string | void>({
      query: (type) => type ? `blog/posts/?type=${type}` : 'blog/posts/',
      transformResponse: (response: { results: BlogPost[] }) => response.results,
    }),

    // Get single post by slug
    // Resulting URL: /api/blog/posts/my-slug/
    getBlogPost: builder.query<BlogPostDetail, string>({
      query: (slug) => `blog/posts/${slug}/`,
    }),

    // Get comments for a post
    // Resulting URL: /api/blog/posts/my-slug/comments/
    getComments: builder.query<Comment[], string>({
      query: (slug) => `blog/posts/${slug}/comments/`,
      transformResponse: (response: { results: Comment[] } | Comment[]) => {
          // Safety check: if it's already an array, return it. If it's an object, return .results
          return Array.isArray(response) ? response : response.results;
      },
      providesTags: (_result, _error, slug) => [{ type: 'Comments', id: slug }],
    }),

    // Add a comment
    addComment: builder.mutation<Comment, { slug: string; content: string }>({
      query: ({ slug, content }) => ({
        url: `blog/posts/${slug}/comments/`,
        method: 'POST',
        body: { content },
      }),
      invalidatesTags: (_result, _error, { slug }) => [{ type: 'Comments', id: slug }],
    }),

    getTestimonials: builder.query<Testimonial[], void>({
      query: () => 'home/testimonials/',
      transformResponse: (response: { results: Testimonial[] }) => response.results,
    }),

    getDeals: builder.query<Product[], void>({
      query: () => 'products/gifts/',
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
  useAddReviewMutation,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetUserQuery,
  useLazyGetUserQuery,
  useGetMyOrdersQuery,
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useGetBlogPostsQuery,
  useGetBlogPostQuery,
  useGetCommentsQuery,
  useAddCommentMutation,
  useGetTestimonialsQuery,
  useGetDealsQuery,
} = honeypotApi;