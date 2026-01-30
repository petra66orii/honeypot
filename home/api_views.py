from rest_framework import generics
from .models import Testimonial
from .serializers import TestimonialSerializer

class TestimonialListAPI(generics.ListAPIView):
    queryset = Testimonial.objects.all().order_by('-rating')
    serializer_class = TestimonialSerializer
    permission_classes = []