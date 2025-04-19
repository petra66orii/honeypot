from django.db import models
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError


# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=256)
    friendly_name = models.CharField(max_length=256, null=True, blank=True)
    has_discount = models.BooleanField(default=False)

    def __str__(self):
        return self.name

    def get_friendly_name(self):
        return self.friendly_name


class Product(models.Model):
    category = models.ForeignKey(
        'Category',
        null=True,
        blank=True,
        on_delete=models.SET_NULL)
    sku = models.CharField(max_length=254, null=True, blank=True)
    name = models.CharField(max_length=254)
    description = models.TextField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    rating = models.DecimalField(
        max_digits=6,
        decimal_places=2,
        null=True,
        blank=True)
    image = models.ImageField(null=True, blank=True)

    def __str__(self):
        return self.name

    @property
    def average_rating(self):
        approved_reviews = self.productreview_set.filter(approved=True)
        if approved_reviews.exists():
            return round(approved_reviews.aggregate(
                models.Avg('rating'))['rating__avg'], 1)
        return 0

    @property
    def full_bees(self):
        return int(self.average_rating)

    @property
    def has_half_bee(self):
        remainder = self.average_rating - self.full_bees
        return 0.25 <= remainder < 0.75


class ProductReview(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    review_text = models.TextField()
    rating = models.IntegerField(
        choices=[
            (1, '1 star'),
            (2, '2 stars'),
            (3, '3 stars'),
            (4, '4 stars'),
            (5, '5 stars'),
        ],
        null=False,
        blank=False,)
    approved = models.BooleanField(default=False)
    created_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_on"]

    def __str__(self):
        return f"{self.user.username} - {self.rating}★"

    def clean(self):
        if not self.rating:
            raise ValidationError("A rating is required.")
