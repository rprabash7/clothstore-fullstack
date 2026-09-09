from django.contrib import admin
from django.urls import include, path
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse


def api_home(request):
    return JsonResponse({
        'message': 'ClothStore Django Backend is running successfully',
        'endpoints': {
            'products': '/api/products/',
            'admin': '/admin/',
            'otp_request': '/api/auth/otp/request/',
            'otp_login': '/api/auth/login/',
        },
    })


urlpatterns = [
    path('', api_home, name='api-home'),
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),
    path('api/auth/', include('accounts.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
