import json
from django.http import HttpResponse
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.conf import settings

from .models import Order, OrderItem, OrderDraft
from products.models import Product
from decimal import Decimal, ROUND_HALF_UP


class StripeWH_Handler:
    """Handle Stripe webhooks"""

    def __init__(self, request):
        self.request = request

    def _send_confirmation_email(self, order):
        """Send the user a confirmation email"""
        cust_email = order.email
        subject = render_to_string(
            'checkout/emails/confirmation_email_subject.txt',
            {'order': order})
        body = render_to_string(
            'checkout/emails/confirmation_email_body.txt',
            {'order': order, 'contact_email': settings.DEFAULT_FROM_EMAIL})

        send_mail(
            subject,
            body,
            settings.DEFAULT_FROM_EMAIL,
            [cust_email]
        )

    def handle_event(self, event):
        """
        Handle a generic/unknown/unexpected webhook event
        """
        return HttpResponse(
            content=f'Unhandled webhook received: {event["type"]}',
            status=200)

    def handle_payment_intent_succeeded(self, event):
        """
        Handle the payment_intent.succeeded webhook from Stripe
        """
        intent = event.data.object
        pid = intent.id
        print(f"Stripe PID from webhook: {pid}")

        try:
            # Idempotency: if order already exists, just acknowledge
            existing = Order.objects.filter(stripe_pid=pid).first()
            if existing:
                return HttpResponse(
                    content=f'Webhook received: {event["type"]} | '
                    'SUCCESS: Order already exists',
                    status=200)

            # Retrieve draft created before payment confirmation
            draft = OrderDraft.objects.get(stripe_pid=pid)

            order_data = draft.order_data or {}
            items = draft.items or []

            # Validate amount against items total (Stripe amount is in cents)
            total_amount = Decimal("0.00")
            for item in items:
                try:
                    product = Product.objects.get(id=item['id'])
                    total_amount += (product.price * Decimal(item['quantity']))
                except (Product.DoesNotExist, KeyError, TypeError):
                    continue

            expected_cents = int((total_amount * 100).quantize(Decimal("1"), rounding=ROUND_HALF_UP))
            intent_amount = getattr(intent, "amount_received", None) or getattr(intent, "amount", None) or 0

            if expected_cents != intent_amount:
                return HttpResponse(
                    content=f'Webhook received: {event["type"]} | '
                    'ERROR: Amount mismatch',
                    status=400)

            # Create the actual Order
            order = Order.objects.create(
                first_name=order_data.get('firstName', ''),
                last_name=order_data.get('lastName', ''),
                email=order_data.get('email', ''),
                phone_number=order_data.get('phone', ''),
                country=order_data.get('country', ''),
                postcode=order_data.get('postcode', ''),
                town=order_data.get('city', ''),
                street_address1=order_data.get('address', ''),
                county=order_data.get('county', ''),
                stripe_pid=pid,
                bag=json.dumps(items),
                user_profile=draft.user_profile,
            )

            # Create Order Items
            for item in items:
                try:
                    product = Product.objects.get(id=item['id'])
                    OrderItem.objects.create(
                        order=order,
                        product=product,
                        quantity=item['quantity'],
                    )
                except (Product.DoesNotExist, KeyError, TypeError):
                    continue

            # Update totals after items are created
            order.update_total()

            # Optional: save delivery info on first order
            if draft.save_info and draft.user_profile:
                profile = draft.user_profile
                updated = False
                if not profile.phone_number:
                    profile.phone_number = order.phone_number
                    updated = True
                if not profile.street_address1:
                    profile.street_address1 = order.street_address1
                    updated = True
                if not profile.town:
                    profile.town = order.town
                    updated = True
                if not profile.county:
                    profile.county = order.county
                    updated = True
                if not profile.postcode:
                    profile.postcode = order.postcode
                    updated = True
                if not profile.country:
                    profile.country = order.country
                    updated = True
                if updated:
                    profile.save()

            # Send confirmation and clean up draft
            self._send_confirmation_email(order)
            draft.delete()

            return HttpResponse(
                content=f'Webhook received: {event["type"]} | '
                'SUCCESS: Order created and confirmation sent',
                status=200)
        except OrderDraft.DoesNotExist:
            print(f"Order draft with stripe_pid={pid} not found in the database.")
            return HttpResponse(
                content=f'Webhook received: {event["type"]} | '
                'ERROR: Draft not found',
                status=404)

    def handle_payment_intent_payment_failed(self, event):
        """
        Handle the payment_intent.payment_failed webhook from Stripe
        """
        intent = event.data.object
        pid = intent.id
        OrderDraft.objects.filter(stripe_pid=pid).delete()
        return HttpResponse(
            content=f'Webhook received: {event["type"]}',
            status=200)
