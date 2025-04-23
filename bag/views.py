from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from decimal import Decimal
import random

from products.models import Product


def view_bag(request):
    """
    A view that renders the bag contents page with recommendations
    """
    bag = request.session.get('bag', {})
    bag_items = []
    total = Decimal('0.00')
    product_ids = []
    categories = set()

    for item_id, item_data in bag.items():
        product = get_object_or_404(Product, pk=item_id)
        quantity = item_data['quantity'] if isinstance(
            item_data,
            dict
            ) else item_data
        price = Decimal(
            item_data['price']
            ) if isinstance(
                item_data,
                dict
                ) and 'price' in item_data else product.price

        subtotal = price * quantity
        total += subtotal
        product_ids.append(product.id)
        categories.add(product.category)

        bag_items.append({
            'item_id': item_id,
            'product': product,
            'quantity': quantity,
            'price': price,
            'subtotal': subtotal,
        })

    # Get related products and ensure they're not in the bag
    related_products = Product.objects.filter(
        category__in=categories
        ).exclude(id__in=product_ids)
    related_products = list(related_products)
    random.shuffle(related_products)
    recommendations = []

    for product in related_products[:4]:
        discount = Decimal('4.00')
        discounted_price = product.price - discount
        recommendations.append({
            'product': product,
            'original_price': product.price,
            'discounted_price': discounted_price,
            'discount': discount,
        })

    context = {
        'bag_items': bag_items,
        'total': total,
        'recommendations': recommendations,
    }

    return render(request, 'bag/shopping-bag.html', context)


def add_to_bag(request, item_id):
    """
    Add the specified product to the shopping bag
    """
    product = get_object_or_404(Product, pk=item_id)
    quantity = int(request.POST.get('quantity'))
    redirect_url = request.META.get('HTTP_REFERER', 'product_list')

    # Check if this product is being added from the recommendations
    discounted_price = request.POST.get('discounted_price')

    bag = request.session.get('bag', {})

    if discounted_price:
        item_data = {
            'quantity': quantity,
            'price': str(discounted_price),
        }
    else:
        if item_id in bag:
            if isinstance(bag[item_id], dict):
                bag[item_id]['quantity'] += quantity
            else:
                bag[item_id] += quantity
        else:
            bag[item_id] = quantity
        request.session['bag'] = bag
        messages.success(request, f'Added {product.name} to your bag.')
        return redirect(redirect_url)

    # Always overwrite if added with discounted price
    bag[item_id] = item_data

    messages.success(
        request,
        f'Added {product.name} with discount to your bag.'
        )
    request.session['bag'] = bag
    return redirect(redirect_url)


def update_bag(request, item_id):
    """
    Update the quantity of the specified product to the specified amount
    """
    product = get_object_or_404(Product, pk=item_id)
    quantity = int(request.POST.get('quantity'))
    bag = request.session.get('bag', {})

    if item_id in bag:
        item_data = bag[item_id]
        if isinstance(item_data, dict):
            if quantity > 0:
                item_data['quantity'] = quantity
            else:
                bag.pop(item_id)
        else:
            if quantity > 0:
                bag[item_id] = quantity
            else:
                bag.pop(item_id)

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


def buy_now(request, item_id):
    """
    Add the item to the bag and redirect to checkout
    """
    quantity = 1
    redirect_url = '/checkout/'

    bag = request.session.get('bag', {})

    if str(item_id) in bag:
        bag[str(item_id)] += quantity
    else:
        bag[str(item_id)] = quantity

    request.session['bag'] = bag
    return redirect(redirect_url)
