from django.db import models
from django.contrib.auth.models import User


# Create your models here.
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(
        upload_to='profile_pics/',
        null=True,
        blank=True
        )
    phone_number = models.CharField(max_length=20, null=True, blank=True)
    street_address1 = models.CharField(max_length=255)
    street_address2 = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=100)
    county = models.CharField(max_length=100, null=True, blank=True)
    town = models.CharField(max_length=100)
    postcode = models.CharField(max_length=20)

    def __str__(self):
        return self.user.username
