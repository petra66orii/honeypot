from django.urls import path
from . import views
from .webhooks import webhook

urlpatterns = [
    path('', views.checkout, name='checkout'),
    path(
        'checkout_success/<order_number>',
        views.checkout_success,
        name='checkout_success'
        ),
    path(
        'cache_checkout_data/',
        views.cache_checkout_data,
        name='cache_checkout_data'
        ),
    path('wh/', webhook, name='webhook'),
    path('order_management/', views.order_management, name='order_management'),
    path(
        'mark-fulfilled/<order_number>/',
        views.mark_order_fulfilled,
        name='mark_order_fulfilled'
        ),
]
