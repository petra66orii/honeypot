from rest_framework import serializers
from .models import BlogPost, Comment

class CommentSerializer(serializers.ModelSerializer):
    # Display the username instead of just the user ID
    user = serializers.ReadOnlyField(source='user.username')
    
    class Meta:
        model = Comment
        fields = ['id', 'user', 'content', 'created_at', 'approved']
        read_only_fields = ['approved', 'created_at']

class BlogPostListSerializer(serializers.ModelSerializer):
    """Lighter serializer for the main blog page (no content, just snippets)"""
    class Meta:
        model = BlogPost
        fields = [
            'id', 'title', 'slug', 'excerpt', 'featured_image', 
            'created_at', 'post_type'
        ]

class BlogPostDetailSerializer(serializers.ModelSerializer):
    """Full serializer for the single post page"""
    author = serializers.ReadOnlyField(source='author.username')
    # We will fetch comments separately to keep things modular, 
    # but we can also include a count here if you like.
    comment_count = serializers.SerializerMethodField()

    class Meta:
        model = BlogPost
        fields = [
            'id', 'author', 'title', 'slug', 'content', 
            'featured_image', 'created_at', 'updated_at', 
            'post_type', 'comment_count'
        ]

    def get_comment_count(self, obj):
        # Count only approved comments
        return obj.comments.filter(approved=True).count()