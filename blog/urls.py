from . import api_views
from django.urls import path

urlpatterns = [
    # --- API ENDPOINTS (For React) ---
    path('posts/', api_views.BlogPostListAPI.as_view(), name='api_post_list'),
    path('posts/<slug:slug>/', api_views.BlogPostDetailAPI.as_view(), name='api_post_detail'),
    path('posts/<slug:slug>/comments/', api_views.CommentListCreateAPI.as_view(), name='api_post_comments'),
    path('admin/comments/', api_views.AdminCommentViewSet.as_view({'get': 'list'}), name='admin_comments_list'),
    path('admin/comments/<int:pk>/', api_views.AdminCommentViewSet.as_view({'patch': 'partial_update', 'delete': 'destroy'}), name='admin_comments_detail'),
]
