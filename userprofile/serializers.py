from django.contrib.auth.models import User
from rest_framework import serializers
from dj_rest_auth.registration.serializers import RegisterSerializer
from dj_rest_auth.serializers import PasswordResetSerializer
from allauth.account.models import EmailAddress
from allauth.account.utils import user_pk_to_url_str
from django.conf import settings
from django_countries.serializer_fields import CountryField
from .models import UserProfile

class UserProfileSerializer(serializers.ModelSerializer):
    # Read-only fields from the User model
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    is_staff = serializers.BooleanField(source='user.is_staff', read_only=True)
    country = CountryField(required=False, allow_null=True)

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

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['pk', 'username', 'email', 'date_joined', 'is_staff', 'last_login']


class HoneypotRegisterSerializer(RegisterSerializer):
    # 1. Define the fields we want to capture
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Map password/password_confirm to allauth's expected password1/password2
        if hasattr(self, 'initial_data'):
            data = self.initial_data
            if hasattr(data, 'copy'):
                data = data.copy()
            else:
                data = dict(data)
            if 'password' in data and 'password1' not in data:
                data['password1'] = data.get('password')
            if 'password_confirm' in data and 'password2' not in data:
                data['password2'] = data.get('password_confirm')
            self.initial_data = data

    def validate_email(self, email):
        # Bypass the broken 'is_verified' check
        if email and EmailAddress.objects.filter(email=email, verified=True).exists():
            raise serializers.ValidationError("A user is already registered with this e-mail address.")
        return email

    def validate(self, attrs):
        # Delegate to default allauth/dj-rest-auth validation
        return super().validate(attrs)

    def custom_signup(self, request, user):
        # 3. Save the names manually (since the form isn't doing it)
        user.first_name = self.validated_data.get('first_name', '')
        user.last_name = self.validated_data.get('last_name', '')
        user.save()


class FrontendPasswordResetSerializer(PasswordResetSerializer):
    def get_email_options(self):
        def url_generator(request, user, temp_key):
            uid = user_pk_to_url_str(user)
            return f"{settings.URL_FRONTEND}/password-reset/confirm/{uid}/{temp_key}/"

        return {"url_generator": url_generator}
