from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages

from products.models import Product


# Create your views here.
def view_bag(request):
    """
    A view that renders the bag contents page
    """

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

    messages.success(request, f'Added {product.name} to your bag.')

    request.session['bag'] = bag
    return redirect(redirect_url)


def update_bag(request, item_id):
    """
    Update the quantity of the specified product to the specified amount
    """
    product = get_object_or_404(Product, pk=item_id)
    quantity = int(request.POST.get('quantity'))
    bag = request.session.get('bag', {})

    if quantity > 0:
        bag[item_id] = quantity
    else:
        bag.pop(item_id, None)

    messages.success(request, f'{product.name} quantity updated.')
    request.session['bag'] = bag
    return redirect('view_bag')


def remove_from_bag(request, item_id):
    """
    Remove the item from the shopping bag
    """
    try:
        bag = request.session.get('bag', {})
        bag.pop(str(item_id), None)
        request.session['bag'] = bag
        messages.success(request, "Item removed from your bag.")
        return redirect('view_bag')
    except Exception as e:
        messages.error(request, f"Error removing item: {e}.")
        return redirect('view_bag')
