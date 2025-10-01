from django.shortcuts import render
from .serializers import UserSerializers
from rest_framework import generics
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [AllowAny]