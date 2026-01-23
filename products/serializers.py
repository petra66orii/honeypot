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
    # Exposing custom model properties to the API
    average_rating = serializers.ReadOnlyField()
    full_bees = serializers.ReadOnlyField()
    has_half_bee = serializers.ReadOnlyField()

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'sku', 'name', 'description', 
            'price', 'rating', 'image', 'average_rating', 
            'full_bees', 'has_half_bee'
        ]