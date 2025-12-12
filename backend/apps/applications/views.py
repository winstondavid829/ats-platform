from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from django.conf import settings
import requests
import logging

from .models import Application, ApplicationStatusHistory
from .serializers import (
    ApplicationSerializer, ApplicationListSerializer,
    ApplicationCreateSerializer, ApplicationUpdateSerializer,
    BulkStatusUpdateSerializer, ApplicationStatusHistorySerializer
)
from apps.jobs.models import Job

logger = logging.getLogger(__name__)


class IsAuthenticatedOrCreateOnly(permissions.BasePermission):
    """
    Allow create to anyone, other operations require authentication
    """
    def has_permission(self, request, view):
        if request.method == 'POST' and view.action == 'create':
            return True
        return request.user and request.user.is_authenticated


class ApplicationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Application CRUD operations
    
    Create is public (for candidates to apply)
    List, retrieve, update, delete require authentication (recruiters only)
    """
    queryset = Application.objects.select_related('job').prefetch_related('status_history')
    permission_classes = [IsAuthenticatedOrCreateOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'job']
    search_fields = ['candidate_name', 'candidate_email', 'parsed_skills']
    ordering_fields = ['applied_at', 'updated_at', 'score', 'candidate_name']
    ordering = ['-applied_at']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'create':
            return ApplicationCreateSerializer
        elif self.action == 'list':
            return ApplicationListSerializer
        elif self.action in ['update', 'partial_update']:
            return ApplicationUpdateSerializer
        return ApplicationSerializer
    
    def perform_create(self, serializer):
        """
        Create application and call Golang service for resume parsing
        """
        # Get job
        job_id = serializer.validated_data.pop('job_id')
        job = Job.objects.get(id=job_id)
        
        # Save application
        application = serializer.save(job=job)
        
        # Call Golang service for resume parsing
        self._parse_resume(application)
    
    def _parse_resume(self, application):
        """
        Call Golang microservice to parse resume
        Feature #6: Resume Parsing & Scoring
        """
        try:
            # Prepare request data
            resume_url = self.request.build_absolute_uri(application.resume_file.url)
            job_requirements = application.job.get_requirements_list()
            
            golang_url = f"{settings.GOLANG_SERVICE_URL}/parse-resume"
            
            payload = {
                "file_url": resume_url,
                "job_requirements": job_requirements
            }
            
            # Call Golang service
            response = requests.post(
                golang_url,
                json=payload,
                timeout=180
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    parsed_data = data.get('data', {})
                    
                    # Update application with parsed data
                    application.parsed_skills = parsed_data.get('skills', [])
                    application.parsed_experience = parsed_data.get('experience', '')
                    application.parsed_education = parsed_data.get('education', '')
                    application.parsed_email = parsed_data.get('email', '')
                    application.parsed_phone = parsed_data.get('phone', '')
                    application.score = parsed_data.get('score', 0)
                    application.save()
                    
                    logger.info(f"Resume parsed successfully for application {application.id}")
                else:
                    logger.warning(f"Golang service returned error: {data.get('error')}")
            else:
                logger.error(f"Golang service error: {response.status_code} - {response.text}")
                
        except requests.exceptions.Timeout:
            logger.error(f"Timeout calling Golang service for application {application.id}")
        except requests.exceptions.ConnectionError:
            logger.error(f"Connection error to Golang service for application {application.id}")
        except Exception as e:
            logger.error(f"Error parsing resume for application {application.id}: {str(e)}")
    
    def perform_update(self, serializer):
        """Update application and track status changes"""
        application = self.get_object()
        old_status = application.status
        
        # Update application
        updated_app = serializer.save()
        
        # If status changed, record it
        if old_status != updated_app.status:
            ApplicationStatusHistory.objects.create(
                application=updated_app,
                from_status=old_status,
                to_status=updated_app.status,
                changed_by=self.request.user
            )
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def history(self, request, pk=None):
        """
        Get status change history for an application
        """
        application = self.get_object()
        history = application.status_history.all()
        serializer = ApplicationStatusHistorySerializer(history, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def bulk_update(self, request):
        """
        Bulk update application statuses
        Feature #4: Bulk actions
        """
        serializer = BulkStatusUpdateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        application_ids = serializer.validated_data['application_ids']
        new_status = serializer.validated_data['status']
        
        # Update applications
        applications = Application.objects.filter(id__in=application_ids)
        updated_count = 0
        
        for application in applications:
            old_status = application.status
            application.status = new_status
            application.save()
            
            # Create history entry
            ApplicationStatusHistory.objects.create(
                application=application,
                from_status=old_status,
                to_status=new_status,
                changed_by=request.user
            )
            updated_count += 1
        
        return Response({
            'success': True,
            'updated_count': updated_count,
            'message': f'{updated_count} applications updated to {new_status}'
        })
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reparse(self, request, pk=None):
        """
        Re-trigger resume parsing for an application
        """
        application = self.get_object()
        self._parse_resume(application)
        
        # Refresh from database
        application.refresh_from_db()
        serializer = self.get_serializer(application)
        
        return Response({
            'success': True,
            'message': 'Resume parsing triggered',
            'data': serializer.data
        })
