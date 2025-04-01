from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from .models import UserProfile
from .forms import UserProfileForm, EditProfileForm


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


@login_required
def edit_profile(request):
    if request.method == "POST":
        form = EditProfileForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            messages.success(request, "Profile updated successfully!")
            return redirect("userprofile")
    else:
        form = EditProfileForm(instance=request.user)

    return render(
        request,
        "userprofile/edit_profile.html",
        {
            "form": form
            }
        )


@login_required
def change_password(request):
    form = PasswordChangeForm(request.user, request.POST or None)

    if request.method == "POST" and form.is_valid():
        user = form.save()
        update_session_auth_hash(request, user)
        messages.success(request, "Your password was successfully updated!")
        return redirect("edit_profile")

    return render(
        request,
        "allauth/account/password_change.html",
        {
            "form": form
            }
            )
