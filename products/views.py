from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Avg

from .models import Category, Product, ProductReview
from .serializers import CategorySerializer, ProductSerializer, ProductReviewSerializer

# ==========================================
# CUSTOM PERMISSIONS
# ==========================================
class IsAdminOrReadOnly(permissions.BasePermission):
    """
    The request is authenticated as a user, or is a read-only request.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
    
class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a review to edit/delete it.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user


# ==========================================
# PUBLIC VIEWS (Replacing all_products & product_detail)
# ==========================================
class DealProductList(generics.ListAPIView):
    """
    Returns all products that are considered 'deals'.
    No pagination, so the frontend gets the full list to display.
    """
    serializer_class = ProductSerializer
    pagination_class = None # Disable pagination for this specific view
    
    def get_queryset(self):
        # These MUST match the 'Programmatic Name' (slug) in your Django Admin Category list
        target_categories = ['honey_gifts', 'clearance', 'special_deals', 'bundles']
        
        # Filter products where the category name is in our target list
        return Product.objects.filter(category__name__in=target_categories)

class CategoryList(generics.ListAPIView):
    """API endpoint to list all categories."""
    queryset = Category.objects.all().order_by('id')
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]


class ProductList(generics.ListCreateAPIView): # Changed from ListAPIView
    """
    GET: List all products (Public)
    POST: Create a product (Admin only)
    """
    queryset = Product.objects.select_related('category').all().order_by('id')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category__name'] 
    search_fields = ['name', 'description']
    ordering_fields = ['price', 'rating', 'name']

class ProductDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    GET: Retrieve product (Public)
    PUT/PATCH: Update product (Admin only)
    DELETE: Delete product (Admin only)
    """
    queryset = Product.objects.select_related('category').all().order_by('id')
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser)

    def update(self, request, *args, **kwargs):
        print("📥 INCOMING DATA:", request.data) # Check your terminal when you save!
        return super().update(request, *args, **kwargs)

class RelatedProductList(generics.ListAPIView):
    """
    Replaces: The `related_products` logic in `product_detail`
    Fetches 4 products from the same category, excluding the current one.
    """
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        current_product = Product.objects.get(id=product_id)
        return Product.objects.filter(category=current_product.category).exclude(id=product_id)[:4]


# ==========================================
# USER REVIEW VIEWS (Replacing review creation, edit_review, delete_review)
# ==========================================
class ProductReviewListCreate(generics.ListCreateAPIView):
    """
    Replaces: The review listing and creation logic in `product_detail`
    GET: Lists approved reviews.
    POST: Creates a new review (sets approved=False automatically).
    """
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return ProductReview.objects.filter(product_id=product_id, approved=True).order_by('-created_on')

    def perform_create(self, serializer):
        product_id = self.kwargs['product_id']
        serializer.save(user=self.request.user, product_id=product_id, approved=False)


class UserReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Replaces: `edit_review` and `delete_review`
    Allows a user to update or delete their OWN review.
    """
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return ProductReview.objects.filter(user=self.request.user)


# ==========================================
# ADMIN MANAGEMENT VIEWS (Replacing @login_required + is_superuser checks)
# ==========================================

class AdminReviewList(generics.ListAPIView):
    """
    Replaces: `manage_reviews`
    Lists ALL reviews (approved and unapproved) for the admin dashboard.
    """
    queryset = ProductReview.objects.all().order_by('-created_on')
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAdminUser]


class AdminReviewDetail(generics.RetrieveUpdateDestroyAPIView):
    """
    Replaces: `approve_review`, `admin_edit_review`, `admin_delete_review`
    Allows admin to approve, edit, or delete ANY review.
    """
    queryset = ProductReview.objects.all()
    serializer_class = ProductReviewSerializer
    permission_classes = [permissions.IsAdminUser]