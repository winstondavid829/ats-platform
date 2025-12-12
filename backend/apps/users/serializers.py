from rest_framework import serializers
from django.contrib.auth.models import User
from .models import RecruiterProfile


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for User model
    """
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class RegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        # Create recruiter profile
        RecruiterProfile.objects.create(user=user)
        return user


class RecruiterProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for RecruiterProfile model
    """
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = RecruiterProfile
        fields = ['id', 'user', 'phone', 'company', 'created_at']
        read_only_fields = ['id', 'created_at']
