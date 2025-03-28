from django.contrib import admin
from .models import UserProfile


# Register your models here.
class UserProfileAdmin(admin.ModelAdmin):
    list_display = (
        'user',
        'phone_number',
        'street_address1',
        'street_address2',
        'country',
        'county',
        'town',
        'postcode'
    )

    ordering = ('user',)
    search_fields = (
        'user__username',
        'phone_number',
        'street_address1',
        'street_address2',
        'country',
        'county',
        'town',
        'postcode'
        )


admin.site.register(UserProfile, UserProfileAdmin)
