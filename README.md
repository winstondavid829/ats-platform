# 🎯 ATS Platform - Intelligent Applicant Tracking System

> A modern, full-stack Applicant Tracking System built with Django REST Framework, React, and microservices architecture. Features AI-powered resume parsing, real-time job tracking, and seamless candidate management.

[![Live Demo](https://img.shields.io/badge/demo-live-success)](https://v0-g3w3e0w02-winston-s-projects-ceac6185.vercel.app)
[![Backend API](https://img.shields.io/badge/API-Railway-blueviolet)](https://ats-platform-production.up.railway.app)
[![Frontend](https://img.shields.io/badge/frontend-Vercel-black)](https://vercel.com)

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Design Decisions](#design-decisions)
- [Future Enhancements](#future-enhancements)

---

## 🌟 Overview

The ATS Platform is a production-ready application designed to streamline the recruitment process for modern organizations. Built with scalability and performance in mind, it leverages microservices architecture to handle resume parsing, job management, and candidate tracking efficiently.

**What makes this project special:**
- 🚀 **Microservices Architecture** - Separated resume parsing service for scalability
- 🤖 **AI-Powered Resume Parsing** - Golang-based service extracts structured data from PDFs
- 🔐 **JWT Authentication** - Secure, stateless authentication system
- 📱 **Responsive Design** - Mobile-first approach using Tailwind CSS
- ☁️ **Cloud-Native Deployment** - Deployed on Railway (backend) and Vercel (frontend)
- 📊 **RESTful API** - Well-documented, standards-compliant API design

---

## ✨ Features

### For Recruiters
- ✅ **Job Management** - Create, update, and manage job postings with rich descriptions
- ✅ **Application Tracking** - Monitor candidate pipeline through different stages
- ✅ **Resume Analysis** - Automatic parsing and extraction of candidate information
- ✅ **Search & Filter** - Advanced filtering by skills, experience, and location
- ✅ **Dashboard Analytics** - Visual insights into recruitment metrics

### For Candidates
- ✅ **Job Discovery** - Browse available positions with detailed descriptions
- ✅ **One-Click Apply** - Simple application process with resume upload
- ✅ **Application Status** - Track application progress in real-time
- ✅ **Profile Management** - Maintain professional profile with resume history

### Technical Features
- ✅ **JWT Token-Based Auth** - Secure authentication with access/refresh tokens
- ✅ **File Upload Handling** - Efficient resume storage with validation
- ✅ **CORS Configuration** - Proper cross-origin resource sharing setup
- ✅ **Database Migrations** - Automated schema management with Django ORM
- ✅ **Error Handling** - Graceful degradation and comprehensive logging
- ✅ **API Pagination** - Efficient data loading for large datasets

---

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────────┐
│                 │         │                  │         │                 │
│  React Frontend │────────▶│  Django Backend  │────────▶│  MySQL Database │
│   (Vercel)      │         │    (Railway)     │         │   (Railway)     │
│                 │         │                  │         │                 │
└─────────────────┘         └────────┬─────────┘         └─────────────────┘
                                     │
                                     │ HTTP Calls
                                     │
                            ┌────────▼─────────┐
                            │                  │
                            │  Golang Service  │
                            │  Resume Parser   │
                            │   (Railway)      │
                            │                  │
                            └──────────────────┘
```

### Communication Flow
1. **Frontend → Backend**: REST API calls with JWT authentication
2. **Backend → Database**: Django ORM queries via PyMySQL
3. **Backend → Golang Service**: Internal network HTTP requests for resume parsing
4. **Backend → Frontend**: JSON responses with CORS headers

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState, useEffect, useContext)
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Deployment**: Vercel (automatic deployments from GitHub)

### Backend
- **Framework**: Django 4.2.27 with Django REST Framework 3.16
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Database**: MySQL 8.0
- **ORM**: Django ORM with PyMySQL
- **API Docs**: Browsable API (DRF)
- **File Handling**: Django File Storage with WhiteNoise
- **CORS**: django-cors-headers
- **Deployment**: Railway (with automatic migrations)

### Microservices
- **Resume Parser**: Golang 1.21 with Gin framework
- **PDF Processing**: Go-based PDF extraction libraries
- **API Design**: RESTful endpoints with JSON responses
- **Deployment**: Railway (Docker containerized)

### Database
- **RDBMS**: MySQL 8.0
- **Hosting**: Railway (managed MySQL instance)
- **Connection**: Internal Railway network for low latency
- **Migrations**: Django migration system

### DevOps & Tools
- **Version Control**: Git & GitHub
- **CI/CD**: Automatic deployments via Railway & Vercel
- **Environment Management**: python-decouple
- **Containerization**: Docker (for Golang service)
- **Process Management**: Gunicorn (WSGI server)

---

## 🚀 Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8.0+
- Go 1.21+ (for resume parser)
- Git

### Backend Setup

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/ats-platform.git
cd ats-platform/backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Configure environment variables**

Create `.env` file in backend directory:
```env
SECRET_KEY=your-secret-key-here
DEBUG=True
DATABASE_URL=mysql://root:password@localhost:3306/ats_db
GOLANG_SERVICE_URL=http://localhost:8080
CORS_ALLOW_ALL_ORIGINS=True
```

5. **Run migrations**
```bash
python manage.py migrate
```

6. **Create superuser**
```bash
python manage.py createsuperuser
```

7. **Run development server**
```bash
python manage.py runserver
```

Backend will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**

Create `.env.local` file:
```env
VITE_API_URL=http://localhost:8000
```

4. **Run development server**
```bash
npm run dev
```

Frontend will be available at `http://localhost:5173`

### Golang Service Setup

1. **Navigate to golang service**
```bash
cd golang-service
```

2. **Install dependencies**
```bash
go mod download
```

3. **Run the service**
```bash
go run main.go
```

Service will be available at `http://localhost:8080`

---

## 🌐 Deployment

### Production URLs
- **Frontend**: https://v0-g3w3e0w02-winston-s-projects-ceac6185.vercel.app
- **Backend API**: https://ats-platform-production.up.railway.app
- **Resume Parser**: https://charismatic-freedom-production-109d.up.railway.app

### Backend Deployment (Railway)

**Configuration Files:**
- `Procfile`: Defines web and release commands
- `runtime.txt`: Specifies Python version
- `requirements.txt`: Python dependencies

**Environment Variables:**
```bash
SECRET_KEY=<generated-secret>
DEBUG=False
DATABASE_URL=${{MySQL.DATABASE_URL}}
GOLANG_SERVICE_URL=http://golang-service.railway.internal:8080
ALLOWED_HOSTS=.railway.app,ats-platform-production.up.railway.app
CORS_ALLOW_ALL_ORIGINS=True
CSRF_TRUSTED_ORIGINS=https://*.railway.app
SECURE_SSL_REDIRECT=False
```

**Deployment Process:**
1. Connect GitHub repository to Railway
2. Select `backend` as root directory
3. Add MySQL database service
4. Configure environment variables
5. Railway automatically builds and deploys on push

### Frontend Deployment (Vercel)

**Environment Variables:**
```bash
VITE_API_URL=https://ats-platform-production.up.railway.app
```

**Deployment Process:**
1. Connect GitHub repository to Vercel
2. Select `frontend` as root directory
3. Framework: Vite
4. Build command: `npm run build`
5. Output directory: `dist`
6. Vercel automatically deploys on push

### Golang Service Deployment (Railway)

**Configuration:**
- `Dockerfile`: Multi-stage build for optimized image
- `go.mod` & `go.sum`: Go dependencies

**Environment Variables:**
```bash
PORT=8080
GIN_MODE=release
```

---

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register/
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe"
}

Response: 201 Created
{
  "user": {...},
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

#### Login
```http
POST /api/auth/login/
Content-Type: application/json

{
  "username": "johndoe",
  "password": "SecurePass123!"
}

Response: 200 OK
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### Job Endpoints

#### List Jobs
```http
GET /api/jobs/?status=active&page=1
Authorization: Bearer <access_token>

Response: 200 OK
{
  "count": 25,
  "next": "/api/jobs/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Senior Python Developer",
      "company": "TechCorp",
      "location": "Remote",
      "salary_range": "150000-250000",
      "posted_date": "2025-12-10",
      ...
    }
  ]
}
```

#### Create Job
```http
POST /api/jobs/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Frontend Developer",
  "description": "We are looking for...",
  "requirements": "React, TypeScript, CSS",
  "location": "New York, NY",
  "job_type": "full_time",
  "salary_min": 100000,
  "salary_max": 150000
}

Response: 201 Created
```

### Application Endpoints

#### Apply for Job
```http
POST /api/jobs/{job_id}/apply/
Authorization: Bearer <access_token>
Content-Type: multipart/form-data

Form Data:
- candidate_name: "John Doe"
- candidate_email: "john@example.com"
- candidate_phone: "+1234567890"
- resume: <file>
- cover_letter: "I am excited to apply..."

Response: 201 Created
{
  "id": 42,
  "job": {...},
  "status": "pending",
  "applied_at": "2025-12-12T10:30:00Z",
  "parsed_resume": {...}
}
```

#### List My Applications
```http
GET /api/applications/my/
Authorization: Bearer <access_token>

Response: 200 OK
{
  "count": 5,
  "results": [...]
}
```

---

## 📁 Project Structure

```
ats-platform/
├── backend/
│   ├── ats_backend/              # Django project settings
│   │   ├── settings.py           # Main configuration
│   │   ├── urls.py               # URL routing
│   │   └── wsgi.py               # WSGI application
│   ├── apps/
│   │   ├── users/                # User management
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   └── views.py
│   │   ├── jobs/                 # Job postings
│   │   │   ├── models.py
│   │   │   ├── serializers.py
│   │   │   ├── views.py
│   │   │   └── filters.py
│   │   └── applications/         # Job applications
│   │       ├── models.py
│   │       ├── serializers.py
│   │       └── views.py
│   ├── requirements.txt          # Python dependencies
│   ├── Procfile                  # Railway deployment config
│   ├── runtime.txt               # Python version
│   └── manage.py                 # Django CLI
├── frontend/
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── Auth/
│   │   │   ├── Jobs/
│   │   │   ├── Applications/
│   │   │   └── Layout/
│   │   ├── pages/                # Route pages
│   │   ├── services/             # API service layer
│   │   ├── context/              # React Context
│   │   ├── utils/                # Helper functions
│   │   └── App.jsx               # Main component
│   ├── package.json              # Node dependencies
│   ├── vite.config.js            # Vite configuration
│   └── tailwind.config.js        # Tailwind CSS config
├── golang-service/
│   ├── main.go                   # Entry point
│   ├── handlers/                 # HTTP handlers
│   ├── services/                 # Business logic
│   ├── models/                   # Data structures
│   ├── go.mod                    # Go dependencies
│   └── Dockerfile                # Container config
└── README.md
```

---

## 🎯 Design Decisions

### Why Microservices for Resume Parsing?
- **Separation of Concerns**: Resume parsing is CPU-intensive and should not block main API
- **Scalability**: Can independently scale Golang service based on parsing load
- **Performance**: Go's concurrency model handles PDF processing efficiently
- **Maintainability**: Easier to update parsing logic without affecting main application

### Why JWT Over Session Authentication?
- **Stateless**: No server-side session storage required
- **Scalability**: Easy to scale horizontally without session synchronization
- **Mobile-Friendly**: Works seamlessly with mobile applications
- **Microservices**: Easy to share authentication across services

### Why MySQL Instead of PostgreSQL?
- **Familiarity**: Team expertise with MySQL
- **Railway Support**: First-class MySQL support on Railway
- **Performance**: Sufficient for current scale (can migrate if needed)
- **Tools**: Rich ecosystem of MySQL management tools

### Why Separate Frontend Deployment?
- **Performance**: Vercel's edge network provides fast global access
- **Build Optimization**: Specialized frontend build pipeline
- **CI/CD**: Independent deployment cycles for frontend and backend
- **Cost**: Optimized pricing for static site hosting

---

## 🔐 Security Considerations

- **JWT Tokens**: Short-lived access tokens (8 hours) with longer refresh tokens (7 days)
- **Password Hashing**: Django's PBKDF2 algorithm with SHA256
- **CORS**: Properly configured cross-origin requests
- **CSRF Protection**: Token-based CSRF protection for admin interface
- **SQL Injection**: Protected via Django ORM parameterized queries
- **File Upload**: Validated file types and size limits
- **Environment Variables**: Sensitive data stored in environment, not code
- **HTTPS**: All production traffic over encrypted connections

---

## 📊 Performance Optimizations

- **Database Connection Pooling**: `conn_max_age=600` for persistent connections
- **Query Optimization**: Selected related objects, prefetch patterns
- **API Pagination**: Page size limited to 50 items
- **Static Files**: WhiteNoise serves static files with compression
- **Internal Networking**: Services communicate via Railway's private network
- **Lazy Loading**: Frontend components loaded on demand
- **Caching Headers**: Appropriate cache-control headers on static assets

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
npm run test
```

### API Testing
```bash
# Test with curl
curl -X POST https://ats-platform-production.up.railway.app/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123456"}'
```

---

## 🚀 Future Enhancements

### Planned Features
- [ ] **Email Notifications** - Automated emails for application status changes
- [ ] **Interview Scheduling** - Calendar integration for interview slots
- [ ] **Video Interviews** - Built-in video conferencing
- [ ] **Analytics Dashboard** - Detailed recruitment metrics and insights
- [ ] **AI Matching** - ML-based job-candidate matching scores
- [ ] **Mobile App** - Native iOS and Android applications
- [ ] **Advanced Search** - Elasticsearch integration for full-text search
- [ ] **Collaborative Hiring** - Team notes and feedback on candidates
- [ ] **Background Checks** - Integration with verification services
- [ ] **Offer Management** - Digital offer letter generation and tracking

### Technical Improvements
- [ ] WebSocket support for real-time notifications
- [ ] Redis caching layer for frequently accessed data
- [ ] GraphQL API alongside REST
- [ ] Comprehensive test coverage (unit, integration, e2e)
- [ ] Performance monitoring with Sentry
- [ ] API rate limiting with Django throttling
- [ ] Automated backup system for database
- [ ] Multi-language support (i18n)

---

## 👥 Contributing

This is a portfolio project, but suggestions and feedback are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 💬 Contact

**Winston David**
- Email: winston.david@ecologital.com
- LinkedIn: [Your LinkedIn Profile]
- Portfolio: [Your Portfolio Website]
- GitHub: [@yourusername](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- Django REST Framework for excellent API development tools
- Railway and Vercel for reliable cloud hosting
- Tailwind CSS for rapid UI development
- The open-source community for various libraries and tools

---

**Built with ❤️ by Winston David | © 2025**
