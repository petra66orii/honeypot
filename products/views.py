from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Avg
from .models import Product, ProductReview
from .forms import ProductForm, ReviewForm


# Create your views here.
def all_products(request):
    """
    A view that displays all of the products
    """
    products = Product.objects.all()
    for product in products:
        # Calculate the average rating for each product
        product.average_rating = product.productreview_set.filter(
            approved=True
            ).aggregate(Avg('rating'))['rating__avg'] or 0
    context = {
        'products': products,
    }

    return render(request, 'products/product_list.html', context)


def product_detail(request, product_id):
    """
    A view to show individual product details
    """
    product = get_object_or_404(Product, pk=product_id)

    reviews = ProductReview.objects.filter(
        product=product,
        approved=True
        ).order_by("-created_on")
    review_count = reviews.count()
    average_rating = product.average_rating()

    review_form = ReviewForm()

    if request.method == "POST":
        review_form = ReviewForm(data=request.POST)
        if review_form.is_valid():
            review = review_form.save(commit=False)
            review.user = request.user
            review.product = product
            review.save()
            messages.success(request, 'Review submitted and awaiting approval')
            review_form = ReviewForm()

    return render(
        request,
        "products/product_detail.html",
        {
            "product": product,
            "reviews": reviews,
            "review_count": review_count,
            "review_form": review_form,
            "average_rating": average_rating,
        },
    )


def edit_review(request, product_id, review_id):
    """
    Handles editing a review.

    Fetches the review object,
    validates the review form with the new content,
    saves the review if valid,
    displays success/error messages,
    and redirects back to the product detail page.
    If the user is not the owner of the review, an error message is displayed.
    """
    review = get_object_or_404(ProductReview, id=review_id, user=request.user)

    if request.method == 'POST':
        form = ReviewForm(request.POST, instance=review)
        if form.is_valid():
            form.save()
            messages.success(request, "Review updated successfully!")
        else:
            messages.error(request, "Oops! Error updating review!")

    return redirect('product_detail', product_id=product_id)


def delete_review(request, product_id, review_id):
    """
    Handles deleting a review.

    Fetches the review object, checks if the user is the owner,
    deletes the review if authorized,
    displays success/error messages,
    and redirects back to the product detail page.
    If the user is not authorized, an error message is displayed.
    """
    review = get_object_or_404(ProductReview, id=review_id, user=request.user)

    if review.user == request.user:
        review.delete()
        messages.success(request, "Review deleted successfully!")
    else:
        messages.error(request, "Failed to delete the review.")

    return redirect('product_detail', product_id=product_id)


# Function borrowed from Boutique Ado walkthrough project
@login_required
def add_product(request):
    """ Add a product to the store """
    if not request.user.is_superuser:
        messages.error(request, 'Sorry, only store owners can do that.')
        return redirect(reverse('home'))

    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES)
        if form.is_valid():
            product = form.save()
            messages.success(request, 'Successfully added product!')
            return redirect(reverse('product_detail', args=[product.id]))
        else:
            messages.error(
                request,
                'Failed to add product. Please ensure the form is valid.'
                )
    else:
        form = ProductForm()

    template = 'products/add_product.html'
    context = {
        'form': form,
    }

    return render(request, template, context)


@login_required
def edit_product(request, product_id):
    """ Edit a product in the store """
    if not request.user.is_superuser:
        messages.error(request, 'Sorry, only store owners can do that.')
        return redirect(reverse('home'))

    product = get_object_or_404(Product, pk=product_id)
    if request.method == 'POST':
        form = ProductForm(request.POST, request.FILES, instance=product)
        if form.is_valid():
            form.save()
            messages.success(request, 'Successfully updated product!')
            return redirect(reverse('product_detail', args=[product.id]))
        else:
            messages.error(
                request,
                'Failed to update product. Please ensure the form is valid.'
                )
    else:
        form = ProductForm(instance=product)
        messages.info(request, f'You are editing {product.name}')

    template = 'products/edit_product.html'
    context = {
        'form': form,
        'product': product,
    }

    return render(request, template, context)


@login_required
def delete_product(request, product_id):
    """ Delete a product from the store """
    if not request.user.is_superuser:
        messages.error(request, 'Sorry, only store owners can do that.')
        return redirect(reverse('home'))

    product = get_object_or_404(Product, pk=product_id)
    product.delete()
    messages.success(request, 'Product deleted!')

    return redirect(reverse('products'))
