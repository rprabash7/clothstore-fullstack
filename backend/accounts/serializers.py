from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'email', 'password', 'username']
    
    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            username=validated_data.get('username', validated_data['email'].split('@')[0]),
            is_active=True
        )
        return user

class OTPRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class OTPVerifySerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class GoogleLoginSerializer(serializers.Serializer):
    access_token = serializers.CharField()