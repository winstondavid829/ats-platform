from django.contrib import admin
from .models import Job


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'location', 'status', 'created_by', 'created_at', 'application_count']
    list_filter = ['status', 'location', 'created_at']
    search_fields = ['title', 'description', 'requirements']
    readonly_fields = ['created_at', 'updated_at', 'application_count']
    
    fieldsets = (
        ('Job Information', {
            'fields': ('title', 'description', 'requirements', 'location')
        }),
        ('Compensation', {
            'fields': ('salary_min', 'salary_max')
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Metadata', {
            'fields': ('created_by', 'created_at', 'updated_at', 'application_count'),
            'classes': ('collapse',)
        }),
    )
