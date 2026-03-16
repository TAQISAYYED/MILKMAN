from django.urls import path
from .views import CustomerAPIView

urlpatterns = [
    path('', CustomerAPIView.as_view(), name='customers'),
    path('<int:pk>/', CustomerAPIView.as_view(), name='customer-detail'),
]