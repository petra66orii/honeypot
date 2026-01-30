from rest_framework import generics, permissions
from .models import BlogPost, Comment
from .serializers import (
    BlogPostListSerializer, 
    BlogPostDetailSerializer, 
    CommentSerializer
)

class BlogPostListAPI(generics.ListAPIView):
    """
    Returns a list of published blog posts.
    """
    serializer_class = BlogPostListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        # Allow filtering by 'blog' or 'recipe' via URL query params
        # e.g., /api/blog/?type=recipe
        queryset = BlogPost.objects.filter(status=1).order_by('-created_at')
        post_type = self.request.query_params.get('type')
        if post_type:
            queryset = queryset.filter(post_type=post_type)
        return queryset

class BlogPostDetailAPI(generics.RetrieveAPIView):
    """
    Returns a single post by slug.
    """
    queryset = BlogPost.objects.filter(status=1)
    serializer_class = BlogPostDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'

class CommentListCreateAPI(generics.ListCreateAPIView):
    """
    GET: List approved comments for a specific post.
    POST: Create a new comment (requires login).
    """
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        # Get the post slug from the URL
        slug = self.kwargs['slug']
        # Return only approved comments for that post
        return Comment.objects.filter(post__slug=slug, approved=True).order_by('-created_at')

    def perform_create(self, serializer):
        # Automatically link the comment to the post and the user
        slug = self.kwargs['slug']
        post = BlogPost.objects.get(slug=slug)
        serializer.save(user=self.request.user, post=post)