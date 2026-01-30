from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions
from .models import UserProfile
from .serializers import UserProfileSerializer

class UserProfileView(generics.RetrieveUpdateAPIView):
    """
    GET: Retrieve the logged-in user's profile
    PATCH: Update the logged-in user's profile
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        # Ensure the user gets their own profile
        return get_object_or_404(UserProfile, user=self.request.user)