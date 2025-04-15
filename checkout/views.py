import stripe
import json
from django.shortcuts import render, redirect, HttpResponse
from django.conf import settings
from django.contrib import messages
from django.views.decorators.http import require_POST
from userprofile.models import UserProfile
from .forms import OrderForm
# from .models import Order, OrderItem
from bag.contexts import bag_contents

stripe.api_key = settings.STRIPE_SECRET_KEY


# Create your views here.
def checkout(request):
    """
    A view that renders the checkout page
    """
    bag = request.session.get('bag', {})
    if not bag:
        messages.error(request, "Your bag is empty.")
        return redirect('products')

    context = bag_contents(request)
    total = context['grand_total']
    stripe_total = round(total * 100)

    intent = stripe.PaymentIntent.create(
        amount=stripe_total,
        currency=settings.STRIPE_CURRENCY,
    )

    if request.method == 'POST':
        form = OrderForm(request.POST)
        if form.is_valid():
            order = form.save(commit=False)
            order.user_profile = request.user.userprofile
            # Add logic for order number, stripe pid, etc
            order.save()
            if request.user.is_authenticated:
                profile = request.user.userprofile
                profile.phone_number = order.phone_number
                profile.street_address1 = order.street_address1
                profile.street_address2 = order.street_address2
                profile.town = order.town_or_city
                profile.county = order.county
                profile.postcode = order.postcode
                profile.country = order.country
                profile.save()
    else:
        if request.user.is_authenticated:
            try:
                profile = request.user.userprofile
                form = OrderForm(initial={
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'email': request.user.email,
                    'phone_number': profile.phone_number,
                    'street_address1': profile.street_address1,
                    'street_address2': profile.street_address2,
                    'town_or_city': profile.town,
                    'county': profile.county,
                    'postcode': profile.postcode,
                    'country': profile.country,
                })
            except UserProfile.DoesNotExist:
                form = OrderForm()
        else:
            form = OrderForm()

    context = {
        'form': form,
        'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
        'client_secret': intent.client_secret,
    }
    return render(request, 'checkout/checkout.html', context)


@require_POST
def cache_checkout_data(request):
    """
    Cache checkout data to be used later in the checkout process
    """
    try:
        pid = request.POST.get('client_secret').split('_secret')[0]
        stripe.PaymentIntent.modify(pid, metadata={
            'bag': json.dumps(request.session.get('bag', {})),
            'save_info': request.POST.get('save_info'),
            'username': request.user.username,
        })
        return HttpResponse(status=200)
    except Exception as e:
        return HttpResponse(content=e, status=400)


def checkout_success(request, order_number):
    """
    Handle successful checkouts
    """
    save_info = request.session.get('save_info')
    order = get_object_or_404(Order, order_number=order_number)
    print("Order number from URL:", order_number)

    if request.user.is_authenticated:
        profile = UserProfile.objects.get(user=request.user)
        order.user_profile = profile
        order.save()

        # Save the user's info
        if save_info:
            profile_data = {
                'phone_number': order.phone_number,
                'country': order.country,
                'postcode': order.postcode,
                'town_or_city': order.town,
                'street_address1': order.street_address1,
                'street_address2': order.street_address2,
                'county': order.county,
            }
            user_profile_form = EditProfileForm(profile_data, instance=profile)
            if user_profile_form.is_valid():
                user_profile_form.save()

    messages.success(request, f'Order successfully processed! \
        Your order number is {order_number}. A confirmation \
        email will be sent to {order.email}.')

    if 'bag' in request.session:
        del request.session['bag']

    template = 'checkout/checkout_success.html'
    context = {
        'order': order,
    }

    return render(request, template, context)
