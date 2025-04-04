from django import forms
from .models import Product, Category, ProductReview


# Product form borrowed from the Boutique Ado walkthrough project
class ProductForm(forms.ModelForm):

    class Meta:
        model = Product
        fields = '__all__'

    image = forms.ImageField(label='Image', required=False)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        categories = Category.objects.all()
        friendly_names = [(c.id, c.get_friendly_name()) for c in categories]

        self.fields['category'].choices = friendly_names
        for field_name, field in self.fields.items():
            field.widget.attrs['class'] = 'border-black rounded-0'


class ReviewForm(forms.ModelForm):
    class Meta:
        model = ProductReview
        fields = ('review_text', 'rating',)
        widgets = {
            'review_text': forms.Textarea(attrs={
                'rows': 9,
                'placeholder': 'Write your review here...'
            }),
            'rating': forms.NumberInput(
                attrs={
                    'id': 'rating-input',
                    'type': 'hidden'
                    }
                    ),
        }
