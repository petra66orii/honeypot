from django.db.models.signals import post_save
from allauth.account.signals import user_signed_up
from django.dispatch import receiver
from django.contrib.auth.models import User
from .models import UserProfile
from django.contrib import messages


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Creates a new UserProfile object for a newly created User.

    This signal handler is triggered upon saving a new User instance.
    If the `created` flag is True (indicating a new user), it creates
    a corresponding UserProfile object associated with the User.

    Args:
      sender: The User model class.
      instance: The newly created User object.
      created: A boolean flag indicating if a new user is created.
    """
    if created:
        UserProfile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Saves the user's profile whenever the User model is saved.

    This signal handler is triggered whenever a User object is saved.
    It assumes the user has an associated Profile object and attempts
    to save the profile object as well.

    Args:
        sender: The User model class.
        instance: The User object being saved.
    """
    instance.profile.save()


@receiver(user_signed_up)
def on_user_signup(request, user, **kwargs):
    """
    Displays a welcome message upon successful user signup
    using Django allauth.

    This signal handler is triggered upon successful user signup
    using Django allauth.
    It displays a success message to the user.

    Args:
        request: The HTTP request object.
        user: The newly created User object.
    """
    messages.success(request,
                     "You have successfully registered!")
