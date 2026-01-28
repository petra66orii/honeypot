from django.urls import path
from . import views
from .webhooks import webhook

urlpatterns = [
    path('create-payment-intent/', views.create_payment_intent, name='create_payment_intent'),
    path('save-order/', views.save_order, name='save_order'),
    path('wh/', webhook, name='webhook'),
]