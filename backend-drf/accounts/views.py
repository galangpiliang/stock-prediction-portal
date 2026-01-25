from django.shortcuts import render
from django.contrib.auth.models import User
from .serializers import UserSerializers
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.tokens import RefreshToken
from decouple import config

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializers
    permission_classes = [AllowAny]

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = {
            'status': 'Request was premitted'
        }
        return Response(response)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def demo_login(request):
    # Get the admin username from Env
    username = config('DJANGO_SUPERUSER_USERNAME')
    
    try:
        user = User.objects.get(username=username)
        
        # Manually create SimpleJWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'username': user.username,
        })
    except User.DoesNotExist:
        return Response(
            {"error": "Demo user not found. Please run migrations/superuser script."}, 
            status=404
        )