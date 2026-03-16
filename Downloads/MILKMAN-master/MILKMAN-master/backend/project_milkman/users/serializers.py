from rest_framework import serializers
from .models import User


# ─────────────────────────────────────────
# User Profile Serializer
# ─────────────────────────────────────────
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model  = User
        fields = ["id", "phone", "name", "email", "is_admin", "created_at"]
        read_only_fields = ["id", "is_admin", "created_at"]


# ─────────────────────────────────────────
# Step 1 — Send OTP
# ─────────────────────────────────────────
class SendOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    name  = serializers.CharField(max_length=120, required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True, allow_null=True)

    def validate_phone(self, value):
        # Strip spaces, keep only digits and leading +
        cleaned = value.strip().replace(" ", "")
        if not cleaned.lstrip("+").isdigit():
            raise serializers.ValidationError("Enter a valid phone number.")
        if len(cleaned.lstrip("+")) < 10:
            raise serializers.ValidationError("Phone number must be at least 10 digits.")
        return cleaned


# ─────────────────────────────────────────
# Step 2 — Verify OTP + Login / Register
# ─────────────────────────────────────────
class VerifyOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=15)
    otp   = serializers.CharField(max_length=6, min_length=6)

    def validate_otp(self, value):
        if not value.isdigit():
            raise serializers.ValidationError("OTP must be 6 digits.")
        return value


# ─────────────────────────────────────────
# Admin Login
# ─────────────────────────────────────────
class AdminLoginSerializer(serializers.Serializer):
    email      = serializers.EmailField()
    password   = serializers.CharField(write_only=True)
    secret_key = serializers.CharField(write_only=True)

    def validate_email(self, value):
        return value.lower().strip()
