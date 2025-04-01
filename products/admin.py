from django.contrib import admin
from .models import Product, Category, ProductReview


# Register your models here.
class ProductAdmin(admin.ModelAdmin):
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
    list_display = (
        'name',
        'friendly_name',
        'has_discount'
    )


class ProductReviewAdmin(admin.ModelAdmin):
    list_display = ("user", "product", "rating", "approved", "created_on")
    list_filter = ("approved", "rating")
    search_fields = ("user__username", "product__name", "review_text")
    actions = ["approve_reviews"]

    def approve_reviews(self, request, queryset):
        queryset.update(approved=True)
    approve_reviews.short_description = "Approve selected reviews"


admin.site.register(Product, ProductAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(ProductReview, ProductReviewAdmin)
