from django.shortcuts import render
from .forms import OrderForm
from userprofile.models import UserProfile


# Create your views here.
def checkout(request):
    """
    A view that renders the checkout page
    """
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
    }
    return render(request, 'checkout/checkout.html', context)
