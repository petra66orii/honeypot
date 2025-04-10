from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages

from products.models import Product


# Create your views here.
def view_bag(request):
    """ A view that renders the bag contents page """

    return render(request, 'bag/shopping-bag.html')


def add_to_bag(request, item_id):
    product = get_object_or_404(Product, pk=item_id)
    quantity = int(request.POST.get('quantity'))
    redirect_url = request.META.get('HTTP_REFERER', 'product_list')

    bag = request.session.get('bag', {})

    if item_id in bag:
        bag[item_id] += quantity
    else:
        bag[item_id] = quantity

    messages.success(request, f'Added {product.name} to your bag')

    request.session['bag'] = bag
    return redirect(redirect_url)
