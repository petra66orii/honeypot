from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    # Show the product name directly instead of just an ID
    product_name = serializers.ReadOnlyField(source='product.name')

    class Meta:
        model = OrderItem
        fields = ['product_name', 'quantity', 'item_total']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = [
            'order_number', 
            'date', 
            'first_name', 
            'last_name',
            'order_total', 
            'total_price', 
            'street_address1', 
            'town', 
            'country', 
            'status', 
            'items'
        ]