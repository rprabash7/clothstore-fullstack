from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from django.core.mail import send_mail
from django.conf import settings
from .models import OTPRequest, generate_otp
from .serializers import (
    RegisterSerializer, LoginSerializer,
    OTPRequestSerializer, OTPVerifySerializer, GoogleLoginSerializer
)

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'message': 'Registration successful. Please login with OTP.',
            'user_id': user.id
        })

class OTPRequestView(generics.GenericAPIView):
    serializer_class = OTPRequestSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        otp = generate_otp()
        
        OTPRequest.objects.create(email=email, otp=otp)
        
        send_mail(
            subject='Your Login OTP - ClothStore',
            message=f'Hello,\n\nYour OTP for login is: {otp}\n\nThis OTP is valid for 5 minutes.\n\nIf you did not request this, please ignore this email.\n\nBest regards,\nClothStore Team',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            fail_silently=False,
        )
        
        return Response({
            'message': 'OTP sent to your email successfully.',
            'email': email
        })

class OTPVerifyView(generics.GenericAPIView):
    serializer_class = OTPVerifySerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']
        
        otp_request = OTPRequest.objects.filter(
            email=email,
            otp=otp,
            is_used=False
        ).first()
        
        if not otp_request or not otp_request.is_valid():
            return Response(
                {'detail': 'Invalid or expired OTP'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user, created = User.objects.get_or_create(
            email=email,
            defaults={'username': email.split('@')[0], 'is_active': True}
        )
        
        otp_request.is_used = True
        otp_request.save()
        
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username
            }
        })

class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data['email'].strip().lower()
        otp = serializer.validated_data['otp'].strip()

        # Latest unused OTP మాత్రమే తీసుకోండి
        otp_request = OTPRequest.objects.filter(
            email__iexact=email,
            otp=otp,
            is_used=False
        ).order_by('-created_at').first()

        if not otp_request:
            return Response(
                {'detail': 'Invalid OTP. Please enter the latest OTP sent to your email.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not otp_request.is_valid():
            return Response(
                {'detail': 'OTP expired. Please request a new OTP.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Same email ki future logins lo same User record untundi
        username = email.split('@')[0]
        user, created = User.objects.get_or_create(
            email__iexact=email,
            defaults={
                'username': username,
                'email': email,
                'is_active': True
            }
        )

        otp_request.is_used = True
        otp_request.save(update_fields=['is_used'])

        token, _ = Token.objects.get_or_create(user=user)

        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username
            }
        })

class GoogleLoginView(generics.GenericAPIView):
    serializer_class = GoogleLoginSerializer
    permission_classes = [AllowAny]
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email = 'demo.user@gmail.com'
        user, created = User.objects.get_or_create(
            email=email,
            defaults={'username': 'demo_user', 'is_active': True}
        )
        
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username
            }
        })