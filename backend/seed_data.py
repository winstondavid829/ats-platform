"""
Script to create sample data for testing
Run: python manage.py shell < seed_data.py
"""

from django.contrib.auth.models import User
from apps.users.models import RecruiterProfile
from apps.jobs.models import Job
from apps.applications.models import Application

# Create test users
print("Creating test users...")
user1, created = User.objects.get_or_create(
    username='recruiter1',
    defaults={
        'email': 'recruiter1@example.com',
        'first_name': 'John',
        'last_name': 'Doe'
    }
)
if created:
    user1.set_password('password123')
    user1.save()
    RecruiterProfile.objects.create(user=user1, company='Ethronix Labs')
    print(f"✓ Created user: {user1.username}")
else:
    print(f"✓ User exists: {user1.username}")

# Create sample jobs
print("\nCreating sample jobs...")
job1, created = Job.objects.get_or_create(
    title='Senior Python Developer',
    defaults={
        'description': 'We are looking for an experienced Python developer to join our team.',
        'requirements': 'Python, Django, REST API, PostgreSQL, 5+ years experience',
        'location': 'Colombo',
        'salary_min': 150000,
        'salary_max': 250000,
        'status': 'active',
        'created_by': user1
    }
)
print(f"✓ Job: {job1.title}")

job2, created = Job.objects.get_or_create(
    title='Frontend Developer',
    defaults={
        'description': 'Join our frontend team to build amazing user experiences.',
        'requirements': 'React, TypeScript, HTML, CSS, JavaScript, 3+ years experience',
        'location': 'Remote',
        'salary_min': 100000,
        'salary_max': 180000,
        'status': 'active',
        'created_by': user1
    }
)
print(f"✓ Job: {job2.title}")

job3, created = Job.objects.get_or_create(
    title='DevOps Engineer',
    defaults={
        'description': 'Looking for a DevOps engineer to manage our infrastructure.',
        'requirements': 'AWS, Docker, Kubernetes, CI/CD, Linux, 4+ years experience',
        'location': 'Kandy',
        'salary_min': 120000,
        'salary_max': 200000,
        'status': 'active',
        'created_by': user1
    }
)
print(f"✓ Job: {job3.title}")

print("\n✅ Sample data created successfully!")
print(f"\nLogin credentials:")
print(f"Username: recruiter1")
print(f"Password: password123")
