from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    # Read-only fields from the User model
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    is_staff = serializers.BooleanField(source='user.is_staff', read_only=True)

    class Meta:
        model = UserProfile
        fields = [
            'username', 
            'email',
            'first_name',
            'last_name',
            'phone_number',
            'street_address1', 
            'street_address2',
            'town', 
            'county', 
            'postcode',
            'country',
            'is_staff'
        ]

class CustomUserDetailsSerializer(serializers.ModelSerializer):
    """
    Used for User data sent immediately after Login/Registration.
    """
    class Meta:
        model = User
        fields = (
            'pk', 
            'username', 
            'email', 
            'first_name', 
            'last_name', 
            'is_staff'  # <--- The magic key!
        )
        read_only_fields = ('email', 'is_staff')