from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='home'),
    path('admin_management/', views.admin_management, name='admin_management'),
]
