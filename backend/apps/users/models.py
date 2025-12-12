from django.contrib.auth.models import User
from django.db import models

# Using Django's built-in User model for simplicity
# Can extend with Profile model if needed

class RecruiterProfile(models.Model):
    """
    Extended profile for recruiters
    """
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='recruiter_profile')
    phone = models.CharField(max_length=20, blank=True)
    company = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.company}"
