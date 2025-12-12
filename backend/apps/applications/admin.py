from django.contrib import admin
from .models import Application, ApplicationStatusHistory


class ApplicationStatusHistoryInline(admin.TabularInline):
    model = ApplicationStatusHistory
    extra = 0
    readonly_fields = ['from_status', 'to_status', 'changed_by', 'changed_at']
    can_delete = False


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = [
        'candidate_name', 'candidate_email', 'job', 'status', 
        'score', 'applied_at'
    ]
    list_filter = ['status', 'job', 'applied_at']
    search_fields = ['candidate_name', 'candidate_email', 'parsed_skills']
    readonly_fields = [
        'applied_at', 'updated_at', 'parsed_skills', 'parsed_experience',
        'parsed_education', 'parsed_email', 'parsed_phone', 'score'
    ]
    inlines = [ApplicationStatusHistoryInline]
    
    fieldsets = (
        ('Job', {
            'fields': ('job',)
        }),
        ('Candidate Information', {
            'fields': (
                'candidate_name', 'candidate_email', 'candidate_phone',
                'linkedin_url', 'cover_letter', 'resume_file'
            )
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Parsed Data (from Golang Service)', {
            'fields': (
                'parsed_skills', 'parsed_experience', 'parsed_education',
                'parsed_email', 'parsed_phone', 'score'
            ),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('applied_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(ApplicationStatusHistory)
class ApplicationStatusHistoryAdmin(admin.ModelAdmin):
    list_display = ['application', 'from_status', 'to_status', 'changed_by', 'changed_at']
    list_filter = ['from_status', 'to_status', 'changed_at']
    search_fields = ['application__candidate_name', 'notes']
    readonly_fields = ['application', 'from_status', 'to_status', 'changed_by', 'changed_at']
