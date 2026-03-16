from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, phone, name="", email="", password=None, address=""):
        if not phone:
            raise ValueError("Phone is required")
        user = self.model(phone=phone, name=name, email=email, address=address)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, name="Admin", email="", password=None):
        user = self.create_user(phone=phone, name=name, email=email, password=password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    phone     = models.CharField(max_length=15, unique=True)
    name      = models.CharField(max_length=120, blank=True, default="")
    email     = models.EmailField(blank=True, null=True)
    address   = models.TextField(blank=True, default="")       # delivery address

    is_active = models.BooleanField(default=True)
    is_staff  = models.BooleanField(default=False)
    is_admin  = models.BooleanField(default=False)

    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD  = "phone"
    REQUIRED_FIELDS = ["name"]

    class Meta:
        db_table = "users"

    def __str__(self):
        return f"{self.name} ({self.phone})"
