from django.contrib import admin
from .models import Product, Category, ProductReview


# Register your models here.
class ProductAdmin(admin.ModelAdmin):
    """
    Admin interface for managing products.
    """
    list_display = (
        'sku',
        'name',
        'category',
        'price',
        'rating',
        'image',
    )

    ordering = ('sku',)


class CategoryAdmin(admin.ModelAdmin):
    """
    Admin interface for managing product categories.
    """
    list_display = (
        'name',
        'friendly_name',
    )


class ProductReviewAdmin(admin.ModelAdmin):
    """
    Admin interface for managing product reviews.
    """
    list_display = ("user", "product", "rating", "approved", "created_on")
    list_filter = ("approved", "rating")
    search_fields = ("user__username", "product__name", "review_text")
    actions = ["approve_reviews"]

    def approve_reviews(self, request, queryset):
        """
        Approve selected reviews.
        """
        queryset.update(approved=True)
    approve_reviews.short_description = "Approve selected reviews"


admin.site.register(Product, ProductAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(ProductReview, ProductReviewAdmin)
