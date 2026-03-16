from django.urls import path
from .views import ProductAPIView

urlpatterns = [
    path('', ProductAPIView.as_view(), name='products'),
    path('<int:pk>/', ProductAPIView.as_view(), name='product-detail'),
]