from .models import Comment
from django import forms


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
