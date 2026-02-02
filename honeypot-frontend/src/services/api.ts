import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Product, Category, ProductFilters, PaymentIntentResponse, CartItem, SaveOrderResponse, SaveOrderRequest, Review, AuthResponse, User, Order, UserProfile, BlogPost, BlogPostDetail, Comment, RegisterRequest, LoginRequest, Testimonial, PaginatedResponse, DashboardStats, } from './types'; 

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
  tagTypes: ['Reviews', 'Profile', 'Comments', 'Products', 'Orders', 'Users'], 

  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedResponse<Product>, ProductFilters>({
      query: (params) => ({
        url: 'products/',
        params: {
          category: params.category,
          search: params.search,
          ordering: params.ordering,
          page: params.page,
        }
      }),
      providesTags: ['Products'],
      // transformResponse: (response: { results: Product[] }) => response.results,
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
      transformResponse: (response: { results: Review[] }) => response.results,
    }),

    // Add Review
    addReview: builder.mutation<{ message: string }, { productId: string; rating: number; review_text: string; product: string }>({
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

    // --- HOME ENDPOINTS ---

    // Get Testimonials
    getTestimonials: builder.query<Testimonial[], void>({
      query: () => 'home/testimonials/',
      transformResponse: (response: { results: Testimonial[] }) => response.results,
    }),

    // Get Deals
    getDeals: builder.query<Product[], void>({
      query: () => 'products/gifts/',
    }),
    
    // Subscribe to Newsletter
    subscribeToNewsletter: builder.mutation<{ message: string }, { email: string }>({
      query: (body) => ({
        url: 'home/newsletter/',
        method: 'POST',
        body,
      }),
    }),

    // Send Contact Message
    sendContactMessage: builder.mutation<{ message: string }, { name: string; email: string; subject: string; message: string }>({
      query: (body) => ({
        url: 'home/contact/',
        method: 'POST',
        body,
      }),
    }),

    // ADMIN ENDPOINTS
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `products/${id}/`, // Adjust if your URL is different (e.g. products/${id})
        method: 'DELETE',
      }),
      // This helps refresh the list immediately after deleting!
      invalidatesTags: ['Products'], 
    }),

    // 1. Get Categories (for the dropdown)
    getAdminCategories: builder.query<Category[], void>({
      query: () => 'categories/', 
    }),

    // 2. Add Product (Multipart Form Data)
    addProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: 'products/',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Products'],
    }),

    // 3. Update Product
    updateProduct: builder.mutation<Product, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `products/${id}/`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),

    // --- ADMIN ORDER ENDPOINTS ---

    // 1. Get All Orders (Paginated)
    getAdminOrders: builder.query<PaginatedResponse<Order>, { page: number }>({
      query: ({ page }) => ({
        url: 'checkout/orders/', // Ensure your Django URL matches this (e.g., router.register('orders', OrderViewSet))
        params: { page },
      }),
      providesTags: ['Orders'],
    }),

    // 2. Update Order Status
    updateOrderStatus: builder.mutation<Order, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `checkout/orders/${id}/`,
        method: 'PATCH',
        body: { status },
      }),
      invalidatesTags: ['Orders'], // Refreshes the list automatically!
    }),

    // --- ADMIN USER ENDPOINTS ---
    getAdminUsers: builder.query<PaginatedResponse<User>, { page: number }>({
      query: ({ page }) => ({
        url: 'profiles/admin/users/', // Matches the URL we just made
        params: { page },
      }),
      providesTags: ['Users'],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (pk) => ({
        url: `profiles/admin/users/${pk}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Users'],
    }),

    toggleUserStaff: builder.mutation<void, number>({
      query: (pk) => ({
        url: `profiles/admin/users/${pk}/toggle_staff/`,
        method: 'PATCH',
      }),
      invalidatesTags: ['Users'],
    }),

    // --- DASHBOARD ENDPOINT ---
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => 'home/admin/stats/',
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
  useSubscribeToNewsletterMutation,
  useSendContactMessageMutation,
  useDeleteProductMutation,
  useAddProductMutation,
  useUpdateProductMutation,
  useGetAdminCategoriesQuery,
  useGetAdminOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetAdminUsersQuery,
  useDeleteUserMutation,
  useToggleUserStaffMutation,
  useGetDashboardStatsQuery,
} = honeypotApi;