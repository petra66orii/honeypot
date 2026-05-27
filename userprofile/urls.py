from django.urls import include, path
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.AdminUserViewSet, basename='admin-users')

urlpatterns = [
    path('', views.UserProfileView.as_view(), name='user_profile'),
    path('admin/', include(router.urls)),
]