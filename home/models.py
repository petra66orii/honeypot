from django.db import models

# Create your models here.
class ProductCarousel(models.Model):
    """
    Model to represent a product in the carousel.
    Each product has a name and an image.

    Attributes:
        name (str): The name of the product.
        image (ImageField): The image of the product.
    """
    name = models.CharField(max_length=255)
    image = models.ImageField(null=True, blank=True)

    def __str__(self):
        return self.name


class Testimonial(models.Model):
    """
    Model to represent a testimonial.
    Each testimonial has a name, text, and rating.
    Attributes:
        name (str): The name of the person giving the testimonial.
        text (str): The text of the testimonial.
        rating (int): The rating given by the person, default is 5.
    """
    name = models.CharField(max_length=100)
    text = models.TextField()
    rating = models.PositiveIntegerField(default=5)

    def __str__(self):
        return f"{self.name} ({self.rating}⭐)"

class NewsletterSubscriber(models.Model):
    email = models.EmailField(unique=True) # unique=True prevents duplicates!
    date_added = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.email
    
class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subject = models.CharField(max_length=200)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.name} - {self.subject}"
