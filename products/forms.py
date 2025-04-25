from django import forms
from .models import Product, Category, ProductReview


# Product form borrowed from the Boutique Ado walkthrough project
class ProductForm(forms.ModelForm):
    """
    Form to create and update products.
    Inherits from Django's ModelForm.
    Attributes:
        Meta (class): Meta class to define the model and fields.
        image (ImageField): Image field for product images.
    """
    class Meta:
        """
        Meta class to define the model and fields for the ProductForm.
        Attributes:
            model (Model): The model to use for the form.
            fields (list): List of fields to include in the form.
        """
        model = Product
        fields = '__all__'

    image = forms.ImageField(label='Image', required=False)

    def __init__(self, *args, **kwargs):
        """
        Initialize the form and set the choices for the category field.
        Args:
            args: Positional arguments.
            kwargs: Keyword arguments.
        """
        super().__init__(*args, **kwargs)
        categories = Category.objects.all()
        friendly_names = [(c.id, c.get_friendly_name()) for c in categories]

        self.fields['category'].choices = friendly_names
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'border-black rounded-1'


class ReviewForm(forms.ModelForm):
    """
    Form to create and update product reviews.
    Inherits from Django's ModelForm.
    Attributes:
        Meta (class): Meta class to define the model and fields.
    """
    class Meta:
        """
        Meta class to define the model and fields for the ReviewForm.
        Attributes:
            model (Model): The model to use for the form.
            fields (list): List of fields to include in the form.
        """
        model = ProductReview
        fields = ('review_text', 'rating',)
        widgets = {
            'review_text': forms.Textarea(attrs={
                'rows': 9,
                'placeholder': 'Write your review here...'
            }),
            'rating': forms.NumberInput(attrs={
                'id': 'rating-input',
                'type': 'hidden',
            }),
        }

    def clean_rating(self):
        """
        Validate the rating field to ensure it is not empty.

        Raises:
            ValidationError: If the rating field is empty.
        Returns:
            rating (int): The validated rating value.
        """
        rating = self.cleaned_data.get('rating')
        if not rating:
            raise forms.ValidationError("Please provide a rating.")
        return rating

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['rating'].required = True
        self.fields['review_text'].required = False
