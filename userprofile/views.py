from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth import update_session_auth_hash
from django.core.paginator import Paginator
from checkout.models import Order
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

    orders = profile.orders.all().order_by('-date')
    paginator = Paginator(orders, 10)
    page_number = request.GET.get('page')
    page_orders = paginator.get_page(page_number)

    context = {
        'form': form,
        'orders': page_orders,
        'on_profile_page': True,
        'page_orders': page_orders,
    }
    return render(request, 'userprofile/profile.html', context)


@login_required
def edit_profile(request):
    if request.method == "POST":
        form = EditProfileForm(
            request.POST,
            instance=request.user,
            user=request.user
            )
        if form.is_valid():
            form.save()
            messages.success(request, "Profile updated successfully!")
            return redirect("userprofile")
    else:
        form = EditProfileForm(instance=request.user, user=request.user)

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


@login_required
def delete_account(request):
    """
    Deletes the user's account.
    Args:
        request: The HTTP request object.
    Returns:
        An HTTPResponse object rendering the
        'delete_account.html' template.
    """
    user = request.user

    if request.method == 'POST' and request.user == user:
        user.delete()
        return redirect('home')

    return render(
        request,
        'userprofile/delete_account.html',
        {
            'user': user
            }
            )


def order_history(request, order_number):
    order = get_object_or_404(Order, order_number=order_number)

    messages.info(request, (
        f'This is a past confirmation for order number {order_number}. '
        'A confirmation email was sent on the order date.'
    ))

    template = 'checkout/checkout_success.html'
    context = {
        'order': order,
        'from_profile': True,
    }

    return render(request, template, context)
