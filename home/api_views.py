from django.contrib.auth.models import User
from django.db.models import Sum, Count
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser, AllowAny
from checkout.models import Order
from products.models import Product
from .models import Testimonial, NewsletterSubscriber, ContactMessage
from .serializers import TestimonialSerializer, NewsletterSerializer, ContactMessageSerializer

class TestimonialListAPI(generics.ListAPIView):
    queryset = Testimonial.objects.all().order_by('-rating')
    serializer_class = TestimonialSerializer
    permission_classes = []

class NewsletterSignupAPI(generics.CreateAPIView):
    """
    Allow any user (even strangers) to sign up for the newsletter.
    """
    queryset = NewsletterSubscriber.objects.all()
    serializer_class = NewsletterSerializer
    permission_classes = [] # No login required

class ContactMessageAPI(generics.CreateAPIView):
    """
    Allow users to send a contact message.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = []

class ContactMessageViewSet(viewsets.ModelViewSet):
    """
    Public: POST (Create) a message.
    Admin: GET (List) all messages.
    """
    queryset = ContactMessage.objects.all().order_by('-created_at')
    serializer_class = ContactMessageSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        return [IsAdminUser()]

class DashboardStatsView(APIView):
    """
    Returns high-level statistics for the Admin Dashboard.
    """
    permission_classes = [IsAdminUser]

    def get(self, request):
        # 1. Basic Counts
        total_users = User.objects.count()
        total_orders = Order.objects.count()
        total_products = Product.objects.count()
        
        # 2. Total Revenue (Sum of all order totals)
        revenue_data = Order.objects.aggregate(total=Sum('total_price'))
        total_revenue = revenue_data['total'] or 0

        # 3. Recent Activity (Last 5 Orders)
        recent_orders = Order.objects.all().order_by('-date')[:5].values(
            'id', 'order_number', 'date', 'total_price', 'status', 'email'
        )

        # 4. Sales Chart Data (Last 7 Days)
        # Group orders by day and sum their revenue
        last_7_days = timezone.now() - timedelta(days=7)
        daily_sales = (
            Order.objects.filter(date__gte=last_7_days)
            .annotate(day=TruncDate('date'))
            .values('day')
            .annotate(sales=Sum('total_price'), count=Count('id'))
            .order_by('day')
        )

        return Response({
            'total_users': total_users,
            'total_orders': total_orders,
            'total_products': total_products,
            'total_revenue': total_revenue,
            'recent_orders': recent_orders,
            'daily_sales': daily_sales
        })