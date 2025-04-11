from django.contrib import admin
from .models import Order


# Register your models here.
class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ('order_number', 'date',
                       'delivery_cost', 'order_total',
                       'total_price',)

    fields = ('order_number', 'date', 'first_name', 'last_name'
              'email', 'phone_number', 'country',
              'postcode', 'town', 'street_address1',
              'street_address2', 'county', 'delivery_cost',
              'order_total', 'total_price',)

    list_display = ('order_number', 'date', 'first_name',
                    'last_name', 'order_total', 'delivery_cost',
                    'total_price',)

    ordering = ('-date',)


admin.site.register(Order, OrderAdmin)
