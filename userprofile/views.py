from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
# from django.contrib import messages
from .models import UserProfile


# Create your views here.
@login_required
def user_profile(request):
    """
    Displays the user's profile page.

    Args:
        request: The HTTP request object.

    Returns:
        An HTTPResponse object rendering the
        'userprofile/profile.html' template
        with the user's profile.
    """
    profile = get_object_or_404(UserProfile, user=request.user)

    return render(
        request, 'userprofile/profile.html',
        {'profile': profile,
         })
