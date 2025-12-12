from django.db import models
from django.contrib.auth.models import User


class Job(models.Model):
    """
    Job posting model
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('closed', 'Closed'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    requirements = models.TextField(help_text="Job requirements - one per line or comma-separated")
    location = models.CharField(max_length=100)
    salary_min = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    
    # Metadata
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs_created')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.title} - {self.status}"
    
    @property
    def application_count(self):
        """Return count of applications for this job"""
        return self.applications.count()
    
    def get_requirements_list(self):
        """Parse requirements into a list"""
        if not self.requirements:
            return []
        # Split by newlines or commas
        requirements = self.requirements.replace('\n', ',').split(',')
        return [req.strip() for req in requirements if req.strip()]
