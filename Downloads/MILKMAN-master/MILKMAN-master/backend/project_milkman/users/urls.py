from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomerRegisterView, CustomerLoginView, AdminLoginView, MeView, LogoutView

urlpatterns = [
    path("customer-register/", CustomerRegisterView.as_view(), name="customer-register"),
    path("customer-login/",    CustomerLoginView.as_view(),    name="customer-login"),
    path("admin-login/",       AdminLoginView.as_view(),       name="admin-login"),
    path("token/refresh/",     TokenRefreshView.as_view(),     name="token-refresh"),
    path("me/",                MeView.as_view(),               name="me"),
    path("logout/",            LogoutView.as_view(),           name="logout"),
]
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import CustomerRegisterView, CustomerLoginView, AdminLoginView, MeView, LogoutView

urlpatterns = [
    path("customer-register/", CustomerRegisterView.as_view(), name="customer-register"),
    path("customer-login/",    CustomerLoginView.as_view(),    name="customer-login"),
    path("admin-login/",       AdminLoginView.as_view(),       name="admin-login"),
    path("token/refresh/",     TokenRefreshView.as_view(),     name="token-refresh"),
    path("me/",                MeView.as_view(),               name="me"),
    path("logout/",            LogoutView.as_view(),           name="logout"),
]
