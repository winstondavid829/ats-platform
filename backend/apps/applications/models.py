from django.db import models
from django.contrib.auth.models import User
from apps.jobs.models import Job


class Application(models.Model):
    """
    Job application model
    """
    STATUS_CHOICES = [
        ('new', 'New'),
        ('screening', 'Screening'),
        ('phone_screen', 'Phone Screen'),
        ('interview', 'Interview'),
        ('offer', 'Offer'),
        ('rejected', 'Rejected'),
    ]
    
    # Job relationship
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    
    # Candidate information
    candidate_name = models.CharField(max_length=200)
    candidate_email = models.EmailField()
    candidate_phone = models.CharField(max_length=20, blank=True)
    linkedin_url = models.URLField(blank=True)
    cover_letter = models.TextField(blank=True)
    
    # Resume file
    resume_file = models.FileField(upload_to='resumes/%Y/%m/%d/')
    
    # Application status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    # Parsed data from Golang service (Feature #6)
    parsed_skills = models.JSONField(default=list, blank=True)
    parsed_experience = models.CharField(max_length=100, blank=True)
    parsed_education = models.CharField(max_length=200, blank=True)
    parsed_email = models.EmailField(blank=True)
    parsed_phone = models.CharField(max_length=20, blank=True)
    score = models.IntegerField(default=0, help_text="Matching score 0-100")
    
    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-applied_at']
        indexes = [
            models.Index(fields=['status', 'applied_at']),
            models.Index(fields=['job', 'status']),
        ]
    
    def __str__(self):
        return f"{self.candidate_name} - {self.job.title} ({self.status})"
    
    def save(self, *args, **kwargs):
        """Track status changes"""
        if self.pk:
            # Get old instance to compare status
            old_instance = Application.objects.get(pk=self.pk)
            if old_instance.status != self.status:
                # Status changed - create history entry
                ApplicationStatusHistory.objects.create(
                    application=self,
                    from_status=old_instance.status,
                    to_status=self.status,
                    changed_by=kwargs.pop('changed_by', None)
                )
        super().save(*args, **kwargs)


class ApplicationStatusHistory(models.Model):
    """
    Track status changes for applications
    """
    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name='status_history'
    )
    from_status = models.CharField(max_length=20)
    to_status = models.CharField(max_length=20)
    changed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='status_changes'
    )
    changed_at = models.DateTimeField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-changed_at']
        verbose_name_plural = 'Application status histories'
    
    def __str__(self):
        return f"{self.application.candidate_name}: {self.from_status} → {self.to_status}"
