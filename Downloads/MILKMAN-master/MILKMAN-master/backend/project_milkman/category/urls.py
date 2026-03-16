from django.urls import path
from .views import CategoryAPIView

urlpatterns = [
    path('', CategoryAPIView.as_view(), name='categories'),
    path('<int:pk>/', CategoryAPIView.as_view(), name='category-detail'),
]