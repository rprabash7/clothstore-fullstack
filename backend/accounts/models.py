from django.db import models
from django.utils import timezone
from datetime import timedelta
import random


def generate_otp():
    return str(random.randint(100000, 999999))


class OTPRequest(models.Model):
    email = models.EmailField()
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    is_used = models.BooleanField(default=False)

    def is_valid(self):
        expiry_time = self.created_at + timedelta(minutes=5)
        return not self.is_used and timezone.now() <= expiry_time

    def __str__(self):
        return f"{self.email} - {self.otp}"