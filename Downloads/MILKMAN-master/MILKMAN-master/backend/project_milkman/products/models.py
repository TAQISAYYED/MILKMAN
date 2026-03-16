from django.db import models
from category.models import Category

class Product(models.Model):

    PACKET_CHOICES = (
        ('500ml', 'Half Litre'),
        ('1L', 'One Litre'),
        ('2L', 'Two Litre'),
    )

    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    packet_size = models.CharField(max_length=10, choices=PACKET_CHOICES)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    stock_quantity = models.IntegerField(default=0)

    def __str__(self):
        return self.name