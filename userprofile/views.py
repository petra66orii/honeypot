from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from rest_framework import viewsets, status, generics, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import UserProfile
from .serializers import UserProfileSerializer, UserSerializer

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
    
class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin-only endpoint to manage users.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    # Custom Action to Toggle Staff Status
    @action(detail=True, methods=['patch'])
    def toggle_staff(self, request, pk=None):
        user = self.get_object()
        # Prevent admin from demoting themselves to avoid lockout
        if user == request.user:
             return Response({'error': 'You cannot demote yourself!'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.is_staff = not user.is_staff
        user.save()
        return Response({'status': 'staff status updated', 'is_staff': user.is_staff})