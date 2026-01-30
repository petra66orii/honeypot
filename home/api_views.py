from rest_framework import generics
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