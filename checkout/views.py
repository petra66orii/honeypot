import stripe
import json

from django.shortcuts import (
    render, redirect, HttpResponse, get_object_or_404, reverse
    )
from django.conf import settings
from django.contrib import messages
from django.views.decorators.http import require_POST

from products.models import Product
from userprofile.forms import EditProfileForm
from userprofile.models import UserProfile
from .forms import OrderForm
from .models import Order, OrderItem
from bag.contexts import bag_contents


# Create your views here.
# Checkout view borrowed and adapted from Code Institute's Boutique Ado project
def checkout(request):
    """
    A view that handles the checkout process
    """
    stripe_secret_key = settings.STRIPE_SECRET_KEY
    stripe_public_key = settings.STRIPE_PUBLIC_KEY

    if request.method == 'POST':
        bag = request.session.get('bag', {})

        form_data = {
            'first_name': request.POST['first_name'],
            'last_name': request.POST['last_name'],
            'email': request.POST['email'],
            'phone_number': request.POST['phone_number'],
            'country': request.POST['country'],
            'postcode': request.POST['postcode'],
            'town': request.POST['town'],
            'street_address1': request.POST['street_address1'],
            'street_address2': request.POST['street_address2'],
            'county': request.POST['county'],
        }
        order_form = OrderForm(form_data)
        if order_form.is_valid():
            order = order_form.save(commit=False)
            pid = request.POST.get('client_secret').split('_secret')[0]
            order.stripe_pid = pid
            order.original_bag = json.dumps(bag)
            order.save()
            for item_id, item_data in bag.items():
                try:
                    product = Product.objects.get(id=item_id)
                    if isinstance(item_data, int):
                        order_item = OrderItem(
                            order=order,
                            product=product,
                            quantity=item_data,
                        )
                        order_item.save()
                    else:
                        for quantity in item_data.items():
                            order_item = OrderItem(
                                order=order,
                                product=product,
                                quantity=quantity,
                            )
                            order_item.save()
                except Product.DoesNotExist:
                    messages.error(request, (
                        "One of the products in your bag wasn't found. "
                        "Please contact us for assistance!")
                    )
                    order.delete()
                    return redirect(reverse('view_bag'))

            request.session['save_info'] = 'save-info' in request.POST
            return redirect(reverse(
                'checkout_success',
                args=[order.order_number]
                )
                )
        else:
            messages.error(request, 'There was an error with your form. \
                Please double check your information.')
    else:
        bag = request.session.get('bag', {})
        if not bag:
            messages.error(
                request,
                "There's nothing in your bag at the moment"
                )
            return redirect(reverse('products'))

        current_bag = bag_contents(request)
        total = current_bag['grand_total']
        stripe_total = round(total * 100)
        stripe.api_key = stripe_secret_key
        intent = stripe.PaymentIntent.create(
            amount=stripe_total,
            currency=settings.STRIPE_CURRENCY,
        )

        if request.user.is_authenticated:
            try:
                profile = UserProfile.objects.get(user=request.user)
                form = OrderForm(initial={
                    'first_name': request.user.first_name,
                    'last_name': request.user.last_name,
                    'email': profile.user.email,
                    'phone_number': profile.phone_number,
                    'country': profile.country,
                    'postcode': profile.postcode,
                    'town': profile.town,
                    'street_address1': profile.street_address1,
                    'street_address2': profile.street_address2,
                    'county': profile.county,
                })
            except UserProfile.DoesNotExist:
                form = OrderForm()
        else:
            form = OrderForm()

    if not stripe_public_key:
        messages.warning(request, 'Stripe public key is missing. \
            Did you forget to set it in your environment?')

    template = 'checkout/checkout.html'
    context = {
        'form': form,
        'stripe_public_key': stripe_public_key,
        'client_secret': intent.client_secret,
    }

    return render(request, template, context)


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
