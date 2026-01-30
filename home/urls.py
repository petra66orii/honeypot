from django.urls import path
from . import views
from . import api_views

urlpatterns = [
    path('testimonials/', api_views.TestimonialListAPI.as_view(), name='api_testimonials'),
    path('newsletter/', api_views.NewsletterSignupAPI.as_view(), name='api_newsletter'),
    path('contact/', api_views.ContactMessageAPI.as_view(), name='api_contact'),
    path('', views.index, name='home'),
    path('admin_management/', views.admin_management, name='admin_management'),
    path('about_us/', views.about_us, name='about_us'),
]
