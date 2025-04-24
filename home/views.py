from django.shortcuts import render

from .models import ProductCarousel, Testimonial


# Create your views here.
def carousel(queryset, n):
    """
    Turns a queryset into blocks of n items
    (e.g. 3 products per carousel slide).
    """
    block = []
    for obj in queryset:
        block.append(obj)
        if len(block) == n:
            yield block
            block = []
    if block:
        yield block


def index(request):
    """ A view to return the index page """

    product_carousel = ProductCarousel.objects.all()
    testimonials = Testimonial.objects.all()

    product_blocks = list(carousel(product_carousel, 3))
    testimonial_blocks = list(carousel(testimonials, 3))

    return render(request, "home/index.html", {
        "product_blocks": product_blocks,
        "testimonial_blocks": testimonial_blocks,
    })


def admin_management(request):
    """ A view to return the admin management page """

    return render(request, "home/admin_management.html")


def about_us(request):
    """ A view to return the About Us page """

    return render(request, "home/about_us.html")
