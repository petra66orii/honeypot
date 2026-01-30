from django.urls import path
from . import views
from . import api_views

urlpatterns = [
    path('testimonials/', api_views.TestimonialListAPI.as_view(), name='api_testimonials'),
    path('', views.index, name='home'),
    path('admin_management/', views.admin_management, name='admin_management'),
    path('about_us/', views.about_us, name='about_us'),
]
