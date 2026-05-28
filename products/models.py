from io import BytesIO
from pathlib import PurePosixPath

from django.core.files.base import ContentFile
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.text import slugify
from PIL import Image, ImageOps


# Create your models here.
class Category(models.Model):
    """
    Category model to define product categories.
    Each category can have a friendly name and a discount flag.
    Attributes:
        name (str): The name of the category.
        friendly_name (str): A user-friendly name for the category.
        has_discount (bool): Indicates if the category has a discount.
    """

    class Meta:
        """
        Meta class to define verbose names for the Category model.
        """
        verbose_name_plural = 'Categories'

    name = models.CharField(max_length=256)
    friendly_name = models.CharField(max_length=256, null=True, blank=True)

    def __str__(self):
        return self.name

    def get_friendly_name(self):
        return self.friendly_name


class Product(models.Model):
    """
    Product model to define products in the store.
    Each product can belong to a category and has various attributes.

    Attributes:
        category (Category): The category to which the product belongs.
        sku (str): Stock Keeping Unit, a unique identifier for the product.
        name (str): The name of the product.
        description (str): A detailed description of the product.
        price (Decimal): The price of the product.
        rating (Decimal): The average rating of the product.
        image (ImageField): An image of the product.
    """
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
    image_thumbnail = models.ImageField(
        upload_to='product_thumbnails/',
        null=True,
        blank=True,
        editable=False,
    )

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        previous_image_name = None
        if self.pk:
            previous_image_name = (
                Product.objects
                .filter(pk=self.pk)
                .values_list('image', flat=True)
                .first()
            )

        super().save(*args, **kwargs)

        image_changed = previous_image_name != self.image.name
        if self.image and (image_changed or not self.image_thumbnail):
            self.generate_thumbnail()

    def generate_thumbnail(self):
        """
        Create a lightweight WebP thumbnail for product-grid cards.
        """
        self.image.open('rb')
        with Image.open(self.image) as source_image:
            thumbnail = ImageOps.exif_transpose(source_image)
            thumbnail.thumbnail((640, 640), Image.Resampling.LANCZOS)

            if thumbnail.mode in ('RGBA', 'LA', 'P'):
                thumbnail = thumbnail.convert('RGB')

            output = BytesIO()
            thumbnail.save(output, format='WEBP', quality=78, method=6)
            output.seek(0)

        stem = PurePosixPath(self.image.name).stem
        thumbnail_name = f"{self.pk}-{slugify(stem) or 'product'}-640.webp"

        if self.image_thumbnail:
            self.image_thumbnail.delete(save=False)

        self.image_thumbnail.save(
            thumbnail_name,
            ContentFile(output.read()),
            save=False,
        )
        super().save(update_fields=['image_thumbnail'])

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
    """
    Model to define product reviews.
    Each review is associated with a user and a product.

    Attributes:
        user (User): The user who wrote the review.
        product (Product): The product being reviewed.
        review_text (str): The text of the review.
        rating (int): The rating given by the user.
        approved (bool): Indicates if the review is approved.
        created_on (DateTime): The date and time when the review was created.
    """
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
        """
        Meta class to define ordering for the ProductReview model.
        """
        ordering = ["created_on"]

    def __str__(self):
        return f"{self.user.username} - {self.rating}★"

    def clean(self):
        """
        Custom validation for the ProductReview model.
        Ensures that the rating is provided and is within the valid range.
        """
        if not self.rating:
            raise ValidationError("A rating is required.")
