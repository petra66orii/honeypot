from django.db import models


# Create your models here.
class ProductCarousel(models.Model):
    """
    Model to represent a product in the carousel.
    """
    name = models.CharField(max_length=255)
    image = models.ImageField(null=True, blank=True)

    def __str__(self):
        return self.name


class Testimonial(models.Model):
    name = models.CharField(max_length=100)
    text = models.TextField()
    rating = models.PositiveIntegerField(default=5)

    def __str__(self):
        return f"{self.name} ({self.rating}⭐)"
