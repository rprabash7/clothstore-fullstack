from django.urls import path
from .views import (
    RegisterView, LoginView, GoogleLoginView,
    OTPRequestView, OTPVerifyView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('otp/request/', OTPRequestView.as_view(), name='otp-request'),
    path('otp/verify/', OTPVerifyView.as_view(), name='otp-verify'),
    path('login/', LoginView.as_view(), name='login'),
    path('google/login/', GoogleLoginView.as_view(), name='google-login'),
]