import stripe
import json
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status, generics

from products.models import Product
from userprofile.models import UserProfile
from .models import Order, OrderItem
from .serializers import OrderSerializer

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
    Handle the checkout process.
    If the user is logged in, attach their profile to the order.
    """
    try:
        data = request.data
        order_data = data.get('order_data', {})
        cart_items = data.get('items', [])
        stripe_pid = data.get('stripe_pid')

        # 1. Create the Order
        order = Order(
            first_name=order_data.get('firstName'),
            last_name=order_data.get('lastName'),
            email=order_data.get('email'),
            phone_number=order_data.get('phone'),
            country=order_data.get('country'),
            postcode=order_data.get('postcode'),
            town=order_data.get('city'),
            street_address1=order_data.get('address'),
            county=order_data.get('county'),
            stripe_pid=stripe_pid,
            bag=json.dumps(cart_items),
        )

        # 2. ROBUST USER HANDLING
        # If the user is logged in, we MUST attach a profile.
        if request.user.is_authenticated:
            try:
                # Try to get the existing profile
                profile = UserProfile.objects.get(user=request.user)
                
                # Optional: Update profile info if 'save_info' was checked
                if data.get('save_info'):
                    profile.default_phone_number = order.phone_number
                    profile.default_street_address1 = order.street_address1
                    profile.default_town = order.town
                    profile.default_county = order.county
                    profile.default_postcode = order.postcode
                    profile.default_country = order.country
                    profile.save()

            except UserProfile.DoesNotExist:
                # FIX: If profile is missing, CREATE IT instead of failing
                profile = UserProfile.objects.create(user=request.user)
            
            # Attach the profile to the order
            order.user_profile = profile

        # 3. Save the Order to DB
        order.save()

        # 4. Create Order Items
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
        print(f"Order Save Error: {e}") 
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
class OrderList(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # If user is Admin, return ALL orders.
        if self.request.user.is_staff:
            return Order.objects.all().order_by('-date')
        
        # Otherwise, return only the user's own orders
        return Order.objects.filter(user_profile__user=self.request.user).order_by('-date')

class AdminOrderDetail(generics.RetrieveUpdateAPIView):
    """
    View to retrieve, update, or delete a specific order.
    Only accessible by Admins.
    """
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAdminUser]

    def perform_update(self, serializer):
        # 1. Get the original order status before saving
        original_instance = self.get_object()
        original_status = original_instance.status

        # 2. Save the new data
        instance = serializer.save()

        # 3. Check if status just changed to 'Shipped' (or 'fulfilled' depending on your choices)
        # Ensure 'Shipped' matches exactly what is in your React dropdown/types.ts
        if original_status != 'Shipped' and instance.status == 'Shipped':
            self._send_shipping_email(instance)

    def _send_shipping_email(self, order):
        """Helper to send the shipping confirmation"""
        subject = render_to_string(
            'checkout/emails/order_fulfilled_email_subject.txt',
            {'order': order}
        )
        body = render_to_string(
            'checkout/emails/order_fulfilled_email_body.txt',
            {
                'order': order,
                'contact_email': settings.DEFAULT_FROM_EMAIL,
            }
        )
        
        # Print to console for testing (optional)
        print(f"Sending shipping email to {order.email}")
        
        send_mail(
            subject,
            body,
            settings.DEFAULT_FROM_EMAIL,
            [order.email]
        )