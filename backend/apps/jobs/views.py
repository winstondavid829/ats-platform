from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Job
from .serializers import JobSerializer, JobListSerializer, JobCreateUpdateSerializer


class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """
    Allow read access to anyone, write access only to authenticated users
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated


class JobViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Job CRUD operations
    
    List and retrieve are public (no auth required)
    Create, update, delete require authentication
    """
    queryset = Job.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['status', 'location']
    search_fields = ['title', 'description', 'requirements']
    ordering_fields = ['created_at', 'title', 'application_count']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """Return appropriate serializer based on action"""
        if self.action == 'list':
            return JobListSerializer
        elif self.action in ['create', 'update', 'partial_update']:
            return JobCreateUpdateSerializer
        return JobSerializer
    
    def perform_create(self, serializer):
        """Set created_by to current user"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['get'], permission_classes=[permissions.AllowAny])
    def applications(self, request, pk=None):
        """
        Get all applications for a specific job
        """
        job = self.get_object()
        from apps.applications.serializers import ApplicationListSerializer
        applications = job.applications.all()
        serializer = ApplicationListSerializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def close(self, request, pk=None):
        """
        Close a job posting
        """
        job = self.get_object()
        job.status = 'closed'
        job.save()
        serializer = self.get_serializer(job)
        return Response(serializer.data)
    
    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def reopen(self, request, pk=None):
        """
        Reopen a closed job posting
        """
        job = self.get_object()
        job.status = 'active'
        job.save()
        serializer = self.get_serializer(job)
        return Response(serializer.data)
