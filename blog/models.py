from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User

STATUS = ((0, 'Draft'), (1, 'Published'))
# Create your models here.


# Blog post model - borrowed and adapted from Codestar Blog project
class BlogPost(models.Model):
    """
    Stores a single blog post entry related to :model:`auth.User`.
    """
    author = models.ForeignKey(User, on_delete=models.CASCADE,
                               related_name='blog_posts')
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.IntegerField(choices=STATUS, default=0)
    excerpt = models.TextField(blank=True)
    featured_image = models.ImageField(null=True, blank=True)

    def save(self, *args, **kwargs):
        """
        Saves the BlogPost instance, generating a unique slug
        if one is not provided.

        If `self.slug` is empty, a slug is generated from
        the `self.title` using `slugify`.
        If a slug with the same value already exists,
        a counter is appended to the slug
        (e.g., "my-post-1", "my-post-2") to ensure uniqueness.

        Args:
        *args: Variable-length argument list passed to the
        parent class's save method.
        **kwargs: Arbitrary keyword arguments passed to the
        parent class's save method.
        """
        if not self.slug:
            # Creates a slug if it's not automatically created - StackOverflow
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            # Ensure uniqueness
            while BlogPost.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} | Written by {self.author}"


# Comments model
class Comment(models.Model):
    """
    Stores a single comment entry related to :model:`auth.User`
    and :model:`blog.BlogPost`.
    """
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE,
                             related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    approved = models.BooleanField(default=False)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Comment by {self.user} on {self.post.title}'
