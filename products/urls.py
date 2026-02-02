from django.urls import path
from . import views

urlpatterns = [
    # ==========================================
    # PUBLIC SHOP ENDPOINTS
    # ==========================================
    # GET: List all categories
    path('categories/', views.CategoryList.as_view(), name='category-list'),
    
    # GET: List all products (supports search, sort, and category filtering)
    path('products/', views.ProductList.as_view(), name='product-list'),
    
    # GET: Retrieve single product details
    path('products/<int:pk>/', views.ProductDetail.as_view(), name='product-detail'),
    
    # GET: Retrieve 4 related products
    path('products/<int:product_id>/related/', views.RelatedProductList.as_view(), name='related-products'),


    # ==========================================
    # USER REVIEW ENDPOINTS
    # ==========================================
    # GET: List approved reviews / POST: Create a new review
    path('products/<int:product_id>/reviews/', views.ProductReviewListCreate.as_view(), name='product-reviews'),
    
    # PUT/PATCH/DELETE: Edit or delete a user's OWN review
    path('reviews/<int:pk>/', views.UserReviewDetail.as_view(), name='user-review-detail'),


    # ==========================================
    # ADMIN DASHBOARD ENDPOINTS (Superuser Only)
    # ==========================================
    # GET: List all products / POST: Add a new product
    path('admin/products/', views.ProductList.as_view(), name='admin-product-list'),
    
    # PUT/PATCH/DELETE: Edit or delete a specific product
    path('admin/products/<int:pk>/', views.ProductDetail.as_view(), name='admin-product-detail'),

    # GET: List ALL reviews (approved and unapproved)
    path('admin/reviews/', views.AdminReviewList.as_view(), name='admin-review-list'),
    
    # PUT/PATCH/DELETE: Approve, edit, or delete ANY review
    path('admin/reviews/<int:pk>/', views.AdminReviewDetail.as_view(), name='admin-review-detail'),
    path('products/gifts/', views.DealProductList.as_view(), name='deals_list'),
    path('products/admin/reviews/', views.AdminReviewViewSet.as_view({'get': 'list'}), name='admin_reviews'),
    path('products/admin/reviews/<int:pk>/', views.AdminReviewViewSet.as_view({
            'delete': 'destroy', 
            'patch': 'partial_update'
        }), name='admin_review_detail'),
        ]