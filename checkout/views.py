import stripe
import json
from django.conf import settings
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from products.models import Product
from userprofile.models import UserProfile
from .models import Order, OrderItem

stripe.api_key = settings.STRIPE_SECRET_KEY

@api_view(['POST'])
@permission_classes([AllowAny])
def create_payment_intent(request):
    """
    Step 1: React sends the cart items.
    We calculate the total server-side and ask Stripe for a PaymentIntent.
    Returns: client_secret and the stripe_pid (payment intent id).
    """
    try:
        data = request.data
        items = data.get('items', [])
        
        # 1. Calculate the total price securely on the server
        total_amount = 0
        for item in items:
            try:
                product = Product.objects.get(id=item['id'])
                # Stripe expects amounts in cents (integer)
                total_amount += int(product.price * 100) * item['quantity']
            except Product.DoesNotExist:
                continue

        if total_amount < 50: # Stripe minimum charge is roughly 0.50 currency units
            return Response({'error': 'Total amount too low'}, status=400)

        # 2. Create the PaymentIntent
        intent = stripe.PaymentIntent.create(
            amount=total_amount,
            currency=settings.STRIPE_CURRENCY,
            automatic_payment_methods={'enabled': True},
            metadata={
                'integration_check': 'accept_a_payment',
            },
        )

        # Return the secrets to React
        return Response({
            'clientSecret': intent.client_secret,
            'id': intent.id, # This is the stripe_pid
        })
        
    except Exception as e:
        return Response({'error': str(e)}, status=403)


@api_view(['POST'])
@permission_classes([AllowAny])
def save_order(request):
    """
    Step 2: React sends the user's address info and the stripe_pid.
    We save the Order to the database immediately.
    This ensures the Order exists BEFORE the Stripe Webhook fires.
    """
    try:
        data = request.data
        order_data = data.get('order_data', {})
        cart_items = data.get('items', [])
        stripe_pid = data.get('stripe_pid')

        # 1. Create the Order
        order = Order(
            full_name=f"{order_data.get('firstName')} {order_data.get('lastName')}",
            email=order_data.get('email'),
            phone_number=order_data.get('phone'),
            country=order_data.get('country'),
            postcode=order_data.get('postcode'),
            town=order_data.get('city'),
            street_address1=order_data.get('address'),
            county=order_data.get('county'),
            stripe_pid=stripe_pid,
            original_bag=json.dumps(cart_items), # Keep for record keeping
        )

        # Attach UserProfile if user is logged in
        if request.user.is_authenticated:
            try:
                profile = UserProfile.objects.get(user=request.user)
                order.user_profile = profile
                
                # Optional: Update profile info if user requested (logic simplified for API)
                if data.get('save_info'):
                    profile.phone_number = order.phone_number
                    profile.street_address1 = order.street_address1
                    profile.country = order.country
                    profile.town = order.town
                    profile.save()
            except UserProfile.DoesNotExist:
                pass

        order.save()

        # 2. Create OrderLineItems
        for item in cart_items:
            try:
                product = Product.objects.get(id=item['id'])
                order_item = OrderItem(
                    order=order,
                    product=product,
                    quantity=item['quantity'],
                )
                order_item.save()
            except Product.DoesNotExist:
                continue

        return Response({'success': True, 'order_number': order.order_number}, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)