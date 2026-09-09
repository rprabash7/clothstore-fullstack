from rest_framework import serializers
from .models import Product, Cart, CartItem

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(read_only=True)

    class Meta:
        model = Product
        fields = [
            'id',
            'name',
            'description',
            'price',
            'category',
            'image',
            'stock',
            'created_at',
        ]


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id',
            'product',
            'quantity',
            'size',
            'added_at',
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = [
            'id',
            'items',
            'created_at',
            'updated_at',
        ]