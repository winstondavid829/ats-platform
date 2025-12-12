from rest_framework import serializers
from .models import Application, ApplicationStatusHistory
from apps.jobs.serializers import JobSerializer, JobListSerializer


class ApplicationStatusHistorySerializer(serializers.ModelSerializer):
    """
    Serializer for application status history
    """
    changed_by_name = serializers.CharField(source='changed_by.get_full_name', read_only=True)
    
    class Meta:
        model = ApplicationStatusHistory
        fields = [
            'id', 'from_status', 'to_status', 'changed_by', 
            'changed_by_name', 'changed_at', 'notes'
        ]
        read_only_fields = ['id', 'changed_at']


class ApplicationSerializer(serializers.ModelSerializer):
    """
    Detailed serializer for Application model
    """
    job = JobSerializer(read_only=True)
    status_history = ApplicationStatusHistorySerializer(many=True, read_only=True)
    resume_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = [
            'id', 'job', 'candidate_name', 'candidate_email', 'candidate_phone',
            'linkedin_url', 'cover_letter', 'resume_file', 'resume_url', 'status',
            'parsed_skills', 'parsed_experience', 'parsed_education',
            'parsed_email', 'parsed_phone', 'score',
            'applied_at', 'updated_at', 'status_history'
        ]
        read_only_fields = [
            'id', 'applied_at', 'updated_at', 
            'parsed_skills', 'parsed_experience', 'parsed_education',
            'parsed_email', 'parsed_phone', 'score'
        ]
    
    def get_resume_url(self, obj):
        """Get full URL for resume file"""
        if obj.resume_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_file.url)
            return obj.resume_file.url
        return None


class ApplicationListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for application listings
    """
    job_title = serializers.CharField(source='job.title', read_only=True)
    job_id = serializers.IntegerField(source='job.id', read_only=True)
    
    class Meta:
        model = Application
        fields = [
            'id', 'job_id', 'job_title', 'candidate_name', 'candidate_email',
            'status', 'score', 'applied_at'
        ]


class ApplicationCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating new applications (public endpoint)
    """
    job_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Application
        fields = [
            'job_id', 'candidate_name', 'candidate_email', 'candidate_phone',
            'linkedin_url', 'cover_letter', 'resume_file'
        ]
    
    def validate_resume_file(self, value):
        """Validate resume file size and type"""
        # Check file size (max 10MB)
        if value.size > 10485760:
            raise serializers.ValidationError("Resume file size cannot exceed 10MB")
        
        # Check file extension
        allowed_extensions = ['.pdf', '.doc', '.docx']
        ext = value.name.lower().split('.')[-1]
        if f'.{ext}' not in allowed_extensions:
            raise serializers.ValidationError(
                "Only PDF, DOC, and DOCX files are allowed"
            )
        
        return value
    
    def validate_job_id(self, value):
        """Validate that job exists and is active"""
        from apps.jobs.models import Job
        try:
            job = Job.objects.get(id=value)
            if job.status != 'active':
                raise serializers.ValidationError("This job posting is no longer active")
        except Job.DoesNotExist:
            raise serializers.ValidationError("Job not found")
        return value


class ApplicationUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating application status
    """
    class Meta:
        model = Application
        fields = ['status']
    
    def validate_status(self, value):
        """Validate status transition"""
        valid_statuses = [choice[0] for choice in Application.STATUS_CHOICES]
        if value not in valid_statuses:
            raise serializers.ValidationError(f"Invalid status. Must be one of: {valid_statuses}")
        return value


class BulkStatusUpdateSerializer(serializers.Serializer):
    """
    Serializer for bulk status updates
    """
    application_ids = serializers.ListField(
        child=serializers.IntegerField(),
        min_length=1
    )
    status = serializers.ChoiceField(choices=Application.STATUS_CHOICES)
