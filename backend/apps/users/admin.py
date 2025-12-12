from django.contrib import admin
from .models import RecruiterProfile


@admin.register(RecruiterProfile)
class RecruiterProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'company', 'phone', 'created_at']
    search_fields = ['user__username', 'user__email', 'company']
    list_filter = ['created_at']
