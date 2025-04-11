from django.db import models
from userprofile.models import UserProfile
from products.models import Product


# Create your models here.
class Order(models.Model):
    order_number = models.CharField(max_length=100, unique=True)
    user_profile = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField()
    phone_number = models.CharField(max_length=20)
    street_address1 = models.CharField(max_length=255)
    street_address2 = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=100)
    town = models.CharField(max_length=100)
    county = models.CharField(max_length=100, null=True, blank=True)
    postcode = models.CharField(max_length=20)
    date = models.DateTimeField(auto_now_add=True)
    delivery_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=0.00
        )
    order_total = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    stripe_pid = models.CharField(max_length=255)

    def __str__(self):
        return self.order_number


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2)
    item_total = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.order.order_number} - {self.product.name}"
