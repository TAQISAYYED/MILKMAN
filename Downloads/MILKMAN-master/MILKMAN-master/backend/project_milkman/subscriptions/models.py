from django.db import models
from customers.models import Customer
from products.models import Product

class Subscription(models.Model):

    SUBSCRIPTION_TYPE = (
        ('daily', 'Daily'),
        ('monthly', 'Monthly'),
        ('quarterly', 'Quarterly'),
        ('yearly', 'Yearly'),
    )

    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('active', 'Active'),
        ('cancelled', 'Cancelled'),
    )

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    subscription_type = models.CharField(max_length=20, choices=SUBSCRIPTION_TYPE)

    start_date = models.DateField()
    end_date = models.DateField()

    transaction_number = models.CharField(max_length=100, null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.customer.name} - {self.product.name}"