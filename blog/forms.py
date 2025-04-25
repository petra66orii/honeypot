from django import forms
from django_summernote.widgets import SummernoteWidget

from .models import BlogPost, Comment


class CreatePost(forms.ModelForm):
    """
    Form class for users to create a post
    """
    class Meta:
        """
        Specify the django model and order of the fields
        """
        model = BlogPost
        fields = ['title',
                  'content',
                  'status',
                  'excerpt',
                  'featured_image',
                  'post_type',
                  ]
        widgets = {
            'content': SummernoteWidget(),
        }


class EditPost(forms.ModelForm):
    """
    Form class for users to edit a post
    """
    class Meta:
        """
        Specify the django model and order of the fields
        """
        model = BlogPost
        fields = ['title',
                  'content',
                  'status',
                  'excerpt',
                  'featured_image',
                  'post_type',
                  ]
        widgets = {
            'content': SummernoteWidget(),
        }


class CommentForm(forms.ModelForm):
    """
    Form class for users to comment on a post
    """
    class Meta:
        """
        Specify the Django model and order of the fields
        """
        model = Comment
        fields = ['content']
