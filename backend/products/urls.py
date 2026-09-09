from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet, CartViewSet

router = DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')

urlpatterns = [
    path('cart/', CartViewSet.as_view({'get': 'list'}), name='cart-list'),
    path('cart/add/', CartViewSet.as_view({'post': 'add_item'}), name='cart-add'),
    path('cart/remove/<int:pk>/', CartViewSet.as_view({'delete': 'remove_item'}), name='cart-remove'),
    path('cart/update/<int:pk>/', CartViewSet.as_view({'put': 'update_quantity'}), name='cart-update'),
    path('cart/clear/', CartViewSet.as_view({'post': 'clear'}), name='cart-clear'),
    path('cart/merge/', CartViewSet.as_view({'post': 'merge_guest_cart'}), name='cart-merge'),

    path('', include(router.urls)),
]