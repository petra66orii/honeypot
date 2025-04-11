from django.shortcuts import render


# Create your views here.
def checkout_view(request):
    """
    A view that renders the checkout page
    """

    return render(request, 'checkout/checkout.html')
