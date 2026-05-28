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
    image_thumbnail = serializers.SerializerMethodField()

    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    # Exposing rating helpers to the API. List views annotate the average to
    # avoid repeated review aggregate queries for every product card.
    average_rating = serializers.SerializerMethodField()
    full_bees = serializers.SerializerMethodField()
    has_half_bee = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            'id', 'category', 'category_id', 'sku', 'name', 'description', 
            'price', 'rating', 'image', 'image_thumbnail', 'average_rating',
            'full_bees', 'has_half_bee'
        ]

    def _average_rating(self, obj):
        if hasattr(obj, 'average_rating_value'):
            annotated_average = obj.average_rating_value
            return round(float(annotated_average), 1) if annotated_average else 0
        return obj.average_rating

    def get_average_rating(self, obj):
        return self._average_rating(obj)

    def get_full_bees(self, obj):
        return int(self._average_rating(obj))

    def get_has_half_bee(self, obj):
        average_rating = self._average_rating(obj)
        remainder = average_rating - int(average_rating)
        return 0.25 <= remainder < 0.75

    def get_image_thumbnail(self, obj):
        if not obj.image_thumbnail:
            return None

        try:
            thumbnail_exists = obj.image_thumbnail.storage.exists(
                obj.image_thumbnail.name
            )
        except Exception:
            return None

        if not thumbnail_exists:
            return None

        request = self.context.get('request')
        thumbnail_url = obj.image_thumbnail.url
        return (
            request.build_absolute_uri(thumbnail_url)
            if request is not None
            else thumbnail_url
        )

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
