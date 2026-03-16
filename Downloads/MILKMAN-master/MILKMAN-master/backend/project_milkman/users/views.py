from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.hashers import make_password, check_password

from .models import User
from .serializers import UserSerializer

import logging
logger = logging.getLogger(__name__)


def get_tokens(user):
    refresh = RefreshToken.for_user(user)
    refresh["name"]     = user.name
    refresh["phone"]    = user.phone
    refresh["is_admin"] = user.is_admin
    return {"refresh": str(refresh), "access": str(refresh.access_token)}


# ─────────────────────────────────────────
# POST /api/auth/customer-register/
# Body: { name, phone, password, address }
# ─────────────────────────────────────────
class CustomerRegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        name     = request.data.get("name", "").strip()
        phone    = request.data.get("phone", "").strip()
        password = request.data.get("password", "")
        address  = request.data.get("address", "").strip()

        if not phone:    return Response({"error": "Phone is required"}, status=400)
        if not password: return Response({"error": "Password is required"}, status=400)
        if not name:     return Response({"error": "Name is required"}, status=400)

        if User.objects.filter(phone=phone).exists():
            return Response({"error": "Account with this phone already exists"}, status=400)

        user = User.objects.create(
            phone=phone, name=name, address=address,
            password=make_password(password),
        )

        return Response({
            "success": True,
            "tokens": get_tokens(user),
            "user": UserSerializer(user).data,
        }, status=201)


# ─────────────────────────────────────────
# POST /api/auth/customer-login/
# Body: { phone, password }
# ─────────────────────────────────────────
class CustomerLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        phone    = request.data.get("phone", "").strip()
        password = request.data.get("password", "")

        if not phone or not password:
            return Response({"error": "Phone and password are required"}, status=400)

        try:
            user = User.objects.get(phone=phone)
        except User.DoesNotExist:
            return Response({"error": "No account found with this phone number"}, status=404)

        if not check_password(password, user.password):
            return Response({"error": "Incorrect password"}, status=401)

        if not user.is_active:
            return Response({"error": "Account is disabled"}, status=403)

        return Response({
            "success": True,
            "tokens": get_tokens(user),
            "user": UserSerializer(user).data,
        })


# ─────────────────────────────────────────
# POST /api/auth/admin-login/
# Body: { email, password }
# ─────────────────────────────────────────
class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email    = request.data.get("email", "").strip().lower()
        password = request.data.get("password", "")

        if not email or not password:
            return Response({"error": "Email and password are required"}, status=400)

        try:
            user = User.objects.get(email=email, is_admin=True)
        except User.DoesNotExist:
            return Response({"error": "No admin account found with this email"}, status=404)

        if not check_password(password, user.password):
            return Response({"error": "Incorrect password"}, status=401)

        if not user.is_active:
            return Response({"error": "Account is disabled"}, status=403)

        return Response({
            "success": True,
            "tokens": get_tokens(user),
            "user": UserSerializer(user).data,
        })


# ─────────────────────────────────────────
# GET /api/auth/me/
# ─────────────────────────────────────────
class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"user": UserSerializer(request.user).data})


# ─────────────────────────────────────────
# POST /api/auth/logout/
# ─────────────────────────────────────────
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            token = RefreshToken(request.data.get("refresh"))
            token.blacklist()
        except Exception:
            pass
        return Response({"success": True, "message": "Logged out"})
