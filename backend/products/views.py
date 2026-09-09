from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Product, Cart, CartItem
from .serializers import ProductSerializer, CartSerializer


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class CartViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def get_cart(self, request):
        """
        Login ayyina user ki user-specific cart.
        Login leni user ki browser session-based guest cart.
        """
        if request.user.is_authenticated:
            cart, _ = Cart.objects.get_or_create(user=request.user)
        else:
            session_id = request.headers.get('X-Session-ID', 'guest')
            cart, _ = Cart.objects.get_or_create(
                user=None,
                session_id=session_id
            )

        return cart

    def list(self, request):
        cart = self.get_cart(request)
        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def add_item(self, request):
        cart = self.get_cart(request)

        product_id = request.data.get('product_id')
        size = request.data.get('size', 'M')

        try:
            quantity = int(request.data.get('quantity', 1))
        except (TypeError, ValueError):
            return Response(
                {'detail': 'Quantity must be a number'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if quantity < 1:
            return Response(
                {'detail': 'Quantity must be at least 1'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response(
                {'detail': 'Product not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        cart_item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            size=size,
            defaults={'quantity': quantity}
        )

        if not created:
            cart_item.quantity += quantity
            cart_item.save(update_fields=['quantity'])

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def remove_item(self, request, pk=None):
        cart = self.get_cart(request)

        try:
            item = cart.items.get(id=pk)
            item.delete()
        except CartItem.DoesNotExist:
            return Response(
                {'detail': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def update_quantity(self, request, pk=None):
        cart = self.get_cart(request)

        try:
            quantity = int(request.data.get('quantity', 1))
        except (TypeError, ValueError):
            return Response(
                {'detail': 'Quantity must be a number'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            item = cart.items.get(id=pk)

            if quantity <= 0:
                item.delete()
            else:
                item.quantity = quantity
                item.save(update_fields=['quantity'])

        except CartItem.DoesNotExist:
            return Response(
                {'detail': 'Cart item not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def clear(self, request):
        cart = self.get_cart(request)
        cart.items.all().delete()

        serializer = CartSerializer(cart)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def merge_guest_cart(self, request):
        """
        OTP login success ayyaka guest cart items ni
        current logged-in user's cart lo merge chestundi.
        """
        if not request.user.is_authenticated:
            return Response(
                {'detail': 'User not authenticated'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        session_id = request.data.get('session_id')

        if not session_id:
            user_cart, _ = Cart.objects.get_or_create(user=request.user)
            serializer = CartSerializer(user_cart)
            return Response(serializer.data, status=status.HTTP_200_OK)

        guest_cart = Cart.objects.filter(
            user=None,
            session_id=session_id
        ).first()

        user_cart, _ = Cart.objects.get_or_create(user=request.user)

        if not guest_cart:
            serializer = CartSerializer(user_cart)
            return Response(serializer.data, status=status.HTTP_200_OK)

        for guest_item in guest_cart.items.all():
            user_item, created = CartItem.objects.get_or_create(
                cart=user_cart,
                product=guest_item.product,
                size=guest_item.size,
                defaults={'quantity': guest_item.quantity}
            )

            if not created:
                user_item.quantity += guest_item.quantity
                user_item.save(update_fields=['quantity'])

        guest_cart.items.all().delete()
        guest_cart.delete()

        serializer = CartSerializer(user_cart)
        return Response(serializer.data, status=status.HTTP_200_OK)