import re

from django import forms
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from .models import UserProfile


class UserProfileForm(forms.ModelForm):
    class Meta:
        model = UserProfile
        exclude = ('user',)

    def __init__(self, *args, **kwargs):
        """
        Add placeholders and classes, remove auto-generated
        labels and set autofocus on first field
        """
        super().__init__(*args, **kwargs)
        placeholders = {
            'phone_number': 'Phone Number',
            'postcode': 'Postal Code',
            'town': 'Town or City',
            'street_address1': 'Street Address 1',
            'street_address2': 'Street Address 2',
            'county': 'County, State or Locality',
        }

        self.fields['phone_number'].widget.attrs['autofocus'] = True
        for field in self.fields:
            if field != 'country':
                if self.fields[field].required:
                    placeholder = f'{placeholders[field]} *'
                else:
                    placeholder = placeholders[field]
                self.fields[field].widget.attrs['placeholder'] = placeholder
            self.fields[field].widget.attrs['class'] = 'border-black rounded-1'
            self.fields[field].label = False


class EditProfileForm(forms.ModelForm):
    """
    Form for editing user profile information.
    Inherits from Django's ModelForm.
    """
    first_name = forms.CharField(
        max_length=50,
        required=True,
        )
    last_name = forms.CharField(
        max_length=50,
        required=True,
        )

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop('user', None)
        super().__init__(*args, **kwargs)

    def clean_username(self):
        username = self.cleaned_data.get("username")
        if username and not re.match(r'^[a-zA-Z0-9@\.\+\-\_]+$', username):
            raise ValidationError(
                "Username may contain only letters, numbers, and @/./+/-/_."
                )
        elif User.objects.filter(username=username).exclude(
                pk=self.user.pk).exists():
            raise ValidationError(
                "Username is already taken. Please choose a different one."
                )
        elif len(username) > 50:
            raise ValidationError(
                "Username must be 50 characters or less."
                )
        elif len(username) < 5:
            raise ValidationError(
                "Username must be at least 5 characters long."
                )
        elif username == "admin":
            raise ValidationError(
                "Username cannot be 'admin'. Please choose a different one."
                )
        return username

    def save(self, commit=True):
        if not self.is_valid():
            return self.instance

        return super().save(commit=commit)

    class Meta:
        model = User
        fields = ["username", "email", "first_name", "last_name"]
        widgets = {
            'username': forms.TextInput(attrs={'placeholder': 'Username'}),
            'email': forms.EmailInput(attrs={'placeholder': 'Email'}),
            'first_name': forms.TextInput(attrs={'placeholder': 'First Name'}),
            'last_name': forms.TextInput(attrs={'placeholder': 'Last Name'}),
        }
