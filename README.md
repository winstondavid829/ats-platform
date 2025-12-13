# ATS Platform - Take Home Assignment

**Deployed Application:**
- **Frontend (React + TypeScript):** https://v0-g3w3e0w02-winston-s-projects-ceac6185.vercel.app
- **Backend API (Django):** https://ats-platform-production.up.railway.app
- **Resume Parser Service (Golang):** https://charismatic-freedom-production-109d.up.railway.app

**Tech Stack:** Django REST Framework | React with TypeScript | Golang | MySQL | Railway | Vercel

---

## Design Decisions

### 1. Microservices Architecture for Resume Parsing

**Decision:** Separate Golang service for resume parsing instead of Django-only solution

**Reasoning:**
- **Performance Isolation:** PDF parsing is CPU-intensive. Isolating it prevents blocking the main API when processing large resumes
- **Independent Scaling:** Can scale the parsing service independently based on upload volume
- **Technology Optimization:** Go's concurrency model (goroutines) handles parallel PDF processing more efficiently than Python
- **Graceful Degradation:** Main application continues functioning even if parsing service has issues

**Trade-offs Considered:**
- Pro: Better performance, scalability, and separation of concerns
- Con: Added complexity in deployment and inter-service communication
- **Conclusion:** For a recruiter handling hundreds of applications, performance and reliability justify the added complexity

### 2. AI-Powered Resume Scoring

**Decision:** Automated skill extraction and job-match scoring (0-100)

**Reasoning:**
- **Recruiter Pain Point:** Manually reviewing hundreds of resumes is time-consuming
- **Solution:** Extract skills from resumes and calculate match score against job requirements
- **Impact:** Recruiter can sort by score and focus on top 20% of candidates first

**Implementation:**
```
Score Calculation:
- Parse resume → Extract skills (NumPy, Python, Docker, etc.)
- Compare with job requirements
- Calculate match percentage
- Return sorted list (highest match first)
```

**Assumption:** Recruiters value objective skill-matching over subjective resume reading

### 3. JWT Authentication Over Session-Based

**Decision:** Stateless JWT authentication instead of Django sessions

**Reasoning:**
- **Scalability:** No server-side session storage needed
- **Microservices Ready:** Multiple services can validate tokens without shared session store
- **Mobile Future-Proof:** JWT works seamlessly with native mobile apps
- **Load Balancing:** Any backend instance can handle any request (no sticky sessions)

**Security Considerations:**
- Short-lived access tokens (8 hours)
- Refresh tokens for extended sessions (7 days)
- HTTPS-only in production

### 4. Status-Based Workflow

**Decision:** Simple status pipeline (Pending → Screening → Interview → Offer → Rejected)

**Reasoning:**
- **Assumption:** Most recruiting workflows follow a linear pipeline
- **Flexibility:** Status can be changed at any time (not enforced progression)
- **Tracking:** Status history automatically recorded with timestamps and user


### 5. Public Job Applications (No Auth Required)

**Decision:** Anyone can apply for jobs without creating an account

**Reasoning:**
- **Candidate Friction:** Forcing registration before applying reduces applications
- **Recruiter Goal:** More qualified candidates in the pipeline
- **User Experience:** Apply with just name, email, phone, and resume

**Security:**
- Applications still validated (email format, file type, size limits)
- Rate limiting prevents spam
- Authenticated recruiters only can view applications

### 6. MySQL Over PostgreSQL

**Decision:** MySQL for relational database

**Reasoning:**
- **Railway Support:** First-class managed MySQL on Railway
- **Sufficient Features:** All required features (JSON fields, full-text search) available
- **Team Familiarity:** Faster development with familiar technology
- **Migration Path:** Can switch to PostgreSQL if needed without application changes (Django ORM abstraction)

**Assumption:** At this scale (hundreds to thousands of applications), MySQL performance is sufficient

### 7. Separate Frontend Deployment

**Decision:** React frontend on Vercel, Django backend on Railway

**Reasoning:**
- **Performance:** Vercel's edge network provides sub-100ms global load times
- **CI/CD:** Independent deployment pipelines for frontend and backend
- **Development Velocity:** Frontend team can deploy without backend changes
- **Cost Optimization:** Static hosting is cheaper than running frontend on backend servers

**Trade-off:** Added CORS configuration complexity (acceptable for better performance)

### 8. File Upload Direct to Django

**Decision:** Upload resumes directly to Django backend, not cloud storage

**Reasoning:**
- **Simplicity:** No additional AWS S3 configuration needed
- **Cost:** No cloud storage costs for MVP
- **Development Speed:** Faster to implement and test
- **Future Migration:** Easy to switch to S3 later with minimal code changes

**Production Consideration:** Document in README that S3 should be used for production at scale

---

## Key Assumptions

### About the Recruiter (Target User)

1. **High Volume:** Recruiter handles 100+ applications per job posting
2. **Time Constraint:** Limited time to review each application (< 2 minutes per resume)
3. **Skill-Focused:** Matching technical skills is the primary screening criterion
4. **Desktop Primary:** Recruiter works primarily from desktop (mobile-responsive but not mobile-first)
5. **Single Team:** One recruiter or small team (no complex permission system needed for MVP)

### About the Recruitment Process

1. **Linear Workflow:** Most candidates move through stages sequentially
2. **Resume is Key:** Resume/CV is the primary evaluation document (not video, portfolio, etc.)
3. **Bulk Actions:** Recruiters need to update multiple applications at once (move 10 candidates to "Interview")
4. **Search Priority:** Searching by skills/keywords is more important than location/salary filters
5. **Status Tracking:** Knowing where each candidate is in the pipeline is critical

### Technical Assumptions

1. **PDF Standard:** Most resumes are PDF format (not Word, HTML, etc.)
2. **English Language:** Resume parsing optimized for English-language resumes
3. **Standard Resume Format:** Common sections (Skills, Experience, Education)
4. **Modern Browsers:** Users on Chrome/Firefox/Safari (last 2 versions)
5. **Upload Size:** Resume files under 5MB (typical PDF resume is 200-500KB)

### Deployment Assumptions

1. **Cloud-Native:** Application will always run in cloud (not on-premise)
2. **Continuous Deployment:** Changes can be deployed immediately (not quarterly releases)
3. **Managed Services:** Database, hosting, SSL managed by platform (Railway/Vercel)
4. **Auto-Scaling:** Platform handles traffic scaling automatically

---

## Features Included

### Core Features (Must Have)
 **Resume Parsing & Scoring** - Automated skill extraction and job matching (highest value)
 **Application Management** - View, filter, search applications
 **Job Posting Management** - Create and manage job listings
 **Status Workflow** - Move candidates through hiring pipeline
 **JWT Authentication** - Secure recruiter access

### Enhanced Features (Should Have)
**Bulk Status Updates** - Update multiple applications at once
**Status History Tracking** - See when and who changed application status
**Advanced Filtering** - Filter by status, job, skills
**Search Functionality** - Search candidates by name, email, skills
**Responsive Design** - Works on mobile/tablet (recruiter on-the-go)

### Features Excluded (Conscious Trade-offs)

**Not Implemented Due to Time Constraints:**
-  Email Notifications - Would require email service integration (SendGrid, AWS SES)
-  Interview Scheduling - Complex calendar integration, lower priority than screening
-  Candidate Portal - Candidates can apply but can't track status (recruiter-focused MVP)
-  Team Collaboration - Comments, notes, shared evaluation (single-user MVP sufficient)
-  Analytics Dashboard - Metrics like time-to-hire, conversion rates (future phase)

**Why These Features Were Deprioritized:**
Focus on solving the core recruiter pain point: **screening hundreds of applications quickly**. Other features add value but don't solve the primary problem.


**Communication Pattern:**
1. **Frontend ↔ Backend:** REST API with JSON, JWT in Authorization header
2. **Backend ↔ Database:** Django ORM (PyMySQL driver)
3. **Backend ↔ Golang:** HTTP POST with file upload (internal Railway network)

### Why This Architecture?

**Separation of Concerns:**
- Frontend: User interface and experience
- Backend: Business logic, authentication, database
- Parser Service: Specialized PDF processing

**Scalability Path:**
- Frontend: Edge network caching (already on Vercel)
- Backend: Horizontal scaling (multiple Railway instances)
- Parser: Independent scaling based on upload volume

**Reliability:**
- Frontend CDN: 99.9% uptime (Vercel SLA)
- Backend: Auto-restart on crash (Railway)
- Parser: Graceful degradation (app works even if parsing fails)

---

## Technology Choices

### Django REST Framework
**Why:** 
- Rapid development with built-in admin, ORM, and authentication
- DRF provides excellent API browsability and documentation
- Large ecosystem for common features (JWT, CORS, filtering)

**Trade-off:** 
- Python can be slower than compiled languages
- **Mitigation:** Offloaded heavy processing (PDF parsing) to Golang

### React with TypeScript
**Why:**
- TypeScript prevents common JavaScript errors (null checks, type mismatches)
- React's component model enables rapid UI development
- Large ecosystem (Tailwind CSS, React Router, Axios)

**Trade-off:**
- Build step required (Vite compilation)
- **Mitigation:** Vercel handles builds automatically

### Golang for PDF Parsing
**Why:**
- Concurrent processing (goroutines) handles multiple resumes efficiently
- Compiled binary deploys easily to Railway
- Excellent PDF parsing libraries available

**Trade-off:**
- Added deployment complexity (second service)
- **Mitigation:** Railway's Docker support makes deployment straightforward

### MySQL Database
**Why:**
- Managed service on Railway (no DevOps overhead)
- JSON field support for parsed resume data
- Full-text search capabilities for skill searching

**Future Consideration:**
- PostgreSQL offers more advanced features (better JSON querying, arrays)
- Easy to migrate via Django migrations if needed


### What Could Be Improved
 **File Storage:** Should have used S3 from start (media serving adds backend load)
 **Testing:** Should have written unit tests alongside development (not after)
 **Error Handling:** More detailed error messages for users (currently generic 500 errors)

### Current Issue Occurred
   **Scoring System:** 
