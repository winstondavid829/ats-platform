from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer, RecruiterProfileSerializer
from .models import RecruiterProfile


class RegisterView(generics.CreateAPIView):
    """
    Register a new recruiter account
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)


class CurrentUserView(APIView):
    """
    Get current authenticated user's details
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)


class LogoutView(APIView):
    """
    Logout view (client-side token removal)
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        return Response({
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)
