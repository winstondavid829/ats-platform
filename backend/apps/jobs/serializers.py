from rest_framework import serializers
from .models import Job
from apps.users.serializers import UserSerializer


class JobSerializer(serializers.ModelSerializer):
    """
    Serializer for Job model
    """
    created_by = UserSerializer(read_only=True)
    application_count = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'description', 'requirements', 'location',
            'salary_min', 'salary_max', 'status', 'created_by',
            'created_at', 'updated_at', 'application_count'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'created_by']
    
    def validate(self, data):
        """Validate salary range"""
        salary_min = data.get('salary_min')
        salary_max = data.get('salary_max')
        
        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError({
                'salary_max': 'Maximum salary must be greater than minimum salary'
            })
        
        return data


class JobListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for job listings
    """
    application_count = serializers.IntegerField(read_only=True)
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    
    class Meta:
        model = Job
        fields = [
            'id', 'title', 'location', 'status', 
            'created_at', 'application_count', 'created_by_name'
        ]


class JobCreateUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating and updating jobs
    """
    class Meta:
        model = Job
        fields = [
            'title', 'description', 'requirements', 'location',
            'salary_min', 'salary_max', 'status'
        ]
    
    def validate(self, data):
        """Validate salary range"""
        salary_min = data.get('salary_min')
        salary_max = data.get('salary_max')
        
        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError({
                'salary_max': 'Maximum salary must be greater than minimum salary'
            })
        
        return data
