from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import UserProfile
from .forms import UserProfileForm


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

    if request.method == 'POST':
        form = UserProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            messages.success(request, 'Profile updated successfully')
        else:
            messages.error(
                request,
                'Update failed. Please ensure the form is valid.'
                )
    else:
        form = UserProfileForm(instance=profile)

    context = {
        'form': form,
        'on_profile_page': True
    }
    return render(request, 'userprofile/profile.html', context)
