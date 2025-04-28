from django.shortcuts import render, redirect, reverse, get_object_or_404
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.db.models import Q
from django.db.models.functions import Lower
from django.core.paginator import Paginator

from .models import Category, Product, ProductReview
from .forms import ProductForm, ReviewForm


# Create your views here.
def all_products(request):
    """
    A view that displays all of the products
    in the store, with optional search and filtering.
    Products can be filtered by category and sorted
    by name, price, or rating.
    """
    products = Product.objects.all()
    query = None
    categories = None
    sort = None
    direction = None

    if request.GET:
        if 'sort' in request.GET:
            sortkey = request.GET['sort']
            sort = sortkey
            if sortkey == 'name':
                sortkey = 'lower_name'
                products = products.annotate(lower_name=Lower('name'))
            if sortkey == 'category':
                sortkey = 'category__name'
            if 'direction' in request.GET:
                direction = request.GET['direction']
                if direction == 'desc':
                    sortkey = f'-{sortkey}'
            products = products.order_by(sortkey)

        if 'category' in request.GET:
            categories = request.GET['category'].split(',')
            products = products.filter(category__name__in=categories)
            categories = Category.objects.filter(name__in=categories)

        if 'q' in request.GET:
            query = request.GET['q']
            if not query:
                messages.error(
                    request,
                    "You didn't enter any search criteria!"
                    )
                return redirect(reverse('products'))

            queries = Q(
                name__icontains=query) | Q(description__icontains=query)
            products = products.filter(queries)

    current_sorting = f'{sort}_{direction}'

    # To silence Django's warning related to pagination
    # when no sorting is applied
    if not sort:
        products = products.order_by('id')

    paginator = Paginator(products, 20)
    page_number = request.GET.get('page')
    page_products = paginator.get_page(page_number)

    start_index = page_products.start_index()
    end_index = page_products.end_index()
    total_products = paginator.count

    context = {
        'products': page_products,
        'search_term': query,
        'current_categories': categories,
        'current_sorting': current_sorting,
        'page_products': page_products,
        'start_index': start_index,
        'end_index': end_index,
        'total_products': total_products,
    }

    return render(request, 'products/product_list.html', context)


def product_detail(request, product_id):
    """
    A view to show individual product details
    and handle product reviews.
    Displays product information, related products,
    reviews, and a review form.
    """
    product = get_object_or_404(Product, pk=product_id)
    related_products = Product.objects.filter(
        category=product.category
        ).exclude(id=product.id)[:4]

    reviews = ProductReview.objects.filter(
        product=product,
        approved=True
        ).order_by("-created_on")
    review_count = reviews.count()
    average_rating = product.average_rating
    paginator = Paginator(reviews, 5)

    page_number = request.GET.get('page')
    page_reviews = paginator.get_page(page_number)

    review_form = ReviewForm()

    if request.method == "POST":
        review_form = ReviewForm(data=request.POST)
        if review_form.is_valid():
            review = review_form.save(commit=False)
            review.user = request.user
            review.product = product
            review.save()
            messages.success(request, 'Review submitted and awaiting approval')
            return redirect('product_detail', product_id=product.id)
        else:
            messages.error(
                request,
                'You cannot submit a review without rating the product.'
                )

    return render(
        request,
        "products/product_detail.html",
        {
            "product": product,
            "reviews": reviews,
            "review_count": review_count,
            "review_form": review_form,
            "average_rating": average_rating,
            "related_products": related_products,
            "page_reviews": page_reviews,
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
            messages.error(
                request,
                "Oops! Error updating review!"
                "Make sure to update your rating as well.")

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
    """
    Add a product to the store
    Only accessible to superusers (store owners).
    """
    if not request.user.is_superuser:
        messages.error(request, 'Sorry, only store owners can do that.')
        return render(request, "403.html")

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
    """
    Edit a product in the store
    Only accessible to superusers (store owners).
    Fetches the product object, validates the form with the new content,
    saves the product if valid, and displays success/error messages.
    """
    if not request.user.is_superuser:
        messages.error(request, 'Sorry, only store owners can do that.')
        return render(request, "403.html")

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
    """
    Delete a product from the store
    Only accessible to superusers (store owners).
    Fetches the product object and deletes it.
    Displays success/error messages.
    """
    if not request.user.is_superuser:
        messages.error(request, 'Sorry, only store owners can do that.')
        return render(request, "403.html")

    product = get_object_or_404(Product, pk=product_id)
    product.delete()
    messages.success(request, 'Product deleted!')

    return redirect(reverse('products'))


# Admin review management views
@login_required
def manage_reviews(request):
    """
    Admin view to manage all reviews (approve, edit, delete).
    Only accessible to superusers (store owners).
    Displays all reviews with options to approve or delete them.
    """
    if not request.user.is_staff:
        # Ensure only admins can access this page
        messages.error(
            request,
            "You do not have permission to view this page."
            )
        return render(request, "403.html")

    reviews = ProductReview.objects.all().order_by("-created_on")

    return render(request, 'products/review_management.html', {
        'reviews': reviews
    })


@login_required
def approve_review(request, review_id):
    """
    Approve a review and allow it to be displayed on the product page.
    Only accessible to superusers (store owners).
    Fetches the review object, sets it as approved,
    and saves the changes.
    """
    if not request.user.is_staff:
        messages.error(
            request,
            "You do not have permission to approve reviews."
            )
        return render(request, "403.html")

    review = get_object_or_404(ProductReview, id=review_id)
    review.approved = True
    review.save()
    messages.success(request, "Review approved successfully!")

    return redirect('manage_reviews')


@login_required
def admin_delete_review(request, review_id):
    """
    Delete a review.
    Only accessible to superusers (store owners).
    Fetches the review object and deletes it.
    Displays success/error messages.
    """
    if not request.user.is_staff:
        messages.error(
            request,
            "You do not have permission to delete reviews."
            )
        return render(request, "403.html")

    review = get_object_or_404(ProductReview, id=review_id)
    review.delete()
    messages.success(request, "Review deleted successfully!")

    return redirect('manage_reviews')


@login_required
def admin_edit_review(request, review_id):
    """
    Edit an existing review.
    Only accessible to superusers (store owners).
    Fetches the review object, validates the form with the new content,
    saves the review if valid, and displays success/error messages.
    """
    if not request.user.is_staff:
        messages.error(
            request,
            "You do not have permission to edit reviews."
            )
        return render(request, "403.html")

    review = get_object_or_404(ProductReview, id=review_id)

    if request.method == "POST":
        form = ReviewForm(request.POST, instance=review)
        if form.is_valid():
            form.save()
            messages.success(request, "Review updated successfully!")
            return redirect('manage_reviews')
        else:
            messages.error(request, "Error updating review.")

    else:
        form = ReviewForm(instance=review)

    return render(request, 'products/edit_review.html', {
        'form': form,
        'review': review
    })
