from rest_framework import serializers
from .models import Category, Product, ProductReview

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'friendly_name']

class ProductReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'product', 'review_text', 'rating', 'approved', 'created_on']
        read_only_fields = ['approved'] # Users can't auto-approve their own reviews

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    # Exposing custom model properties to the API
    average_rating = serializers.ReadOnlyField()
    full_bees = serializers.ReadOnlyField()
    has_half_bee = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_id', 'sku', 'name', 'description', 
            'price', 'rating', 'image', 'average_rating', 
            'full_bees', 'has_half_bee'
        ]

class ReviewSerializer(serializers.ModelSerializer):
    # We want to show the username, not just the user ID
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = ProductReview
        fields = ['id', 'user', 'rating', 'review_text', 'created_at', 'approved']
        read_only_fields = ['is_approved', 'created_at']

class AdminReviewSerializer(ProductReviewSerializer):
    """
    Serializer for Admins to manage reviews.
    Makes 'approved' field writable.
    """
    class Meta(ProductReviewSerializer.Meta):
        # We inherit everything from the parent Meta, but override read_only_fields
        read_only_fields = []