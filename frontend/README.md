# ATS Frontend - React + TypeScript

Modern React frontend for the Applicant Tracking System (ATS) platform.

## Features Implemented

### ✅ Feature #1: Job Management (Public & Auth)
- **Public**: View all active job listings
- **Auth**: Create, edit, close/reopen jobs
- Clean, card-based job listings
- Job detail view with full information

### ✅ Feature #2: Application Submission (Public)
- Public application form for candidates
- Drag-and-drop resume upload (PDF, DOC, DOCX)
- Real-time file validation
- Success confirmation page

### ✅ Feature #3: Pipeline Management (Auth)
- Status change interface with 6 stages:
  - New → Screening → Phone Screen → Interview → Offer → Rejected
- Visual status badges with color coding
- Status history timeline

### ✅ Feature #4: Application Review Interface (Auth)
- Comprehensive filtering system:
  - Filter by job, status
  - Search by name, email, skills
  - Sort by date, score, name
- Clean table view with key information
- Application count and score display

### ✅ Feature #5: Authentication
- User registration and login
- JWT token management with auto-refresh
- Protected routes for recruiter features
- Persistent authentication
- Clean navigation with user context

### ✅ Feature #6: Resume Analysis Display
- Display parsed skills, experience, education
- Visual match score with progress bar
- Re-parse resume functionality
- Resume download

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool (fast dev server)
- **React Router v6** - Routing
- **Axios** - HTTP client with interceptors
- **Tailwind CSS** - Utility-first styling
- **React Dropzone** - File upload
- **date-fns** - Date formatting

## Project Structure

```
frontend/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable components
│   │   ├── Button.tsx      # Reusable button component
│   │   ├── Input.tsx       # Reusable input component
│   │   ├── Layout.tsx      # Main layout with navigation
│   │   ├── ProtectedRoute.tsx  # Auth route wrapper
│   │   └── StatusBadge.tsx # Status badge component
│   ├── contexts/           # React contexts
│   │   └── AuthContext.tsx # Authentication context
│   ├── pages/              # Page components
│   │   ├── LoginPage.tsx
│   │   ├── RegisterPage.tsx
│   │   ├── JobsPage.tsx
│   │   ├── JobFormPage.tsx
│   │   ├── JobApplicationPage.tsx
│   │   ├── ApplicationsPage.tsx
│   │   └── ApplicationDetailPage.tsx
│   ├── services/           # API services
│   │   ├── api.ts          # Axios client with interceptors
│   │   ├── auth.service.ts
│   │   ├── job.service.ts
│   │   └── application.service.ts
│   ├── types/              # TypeScript types
│   │   └── index.ts        # All type definitions
│   ├── utils/              # Helper functions
│   │   └── helpers.ts      # Date, currency, error formatting
│   ├── App.tsx             # Main app with routing
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles + Tailwind
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
├── vite.config.ts          # Vite config
├── tailwind.config.js      # Tailwind CSS config
├── postcss.config.js       # PostCSS config
├── .env.example            # Environment variables template
└── README.md               # This file
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Django backend running on port 8000

### 1. Install Dependencies

```bash
cd frontend
npm install
# or
yarn install
```

### 2. Environment Configuration

```bash
# Copy environment file
cp .env.example .env

# Edit .env if needed (default is http://localhost:8000)
VITE_API_URL=http://localhost:8000
```

### 3. Start Development Server

```bash
npm run dev
# or
yarn dev
```

The app will be available at `http://localhost:3000`

### 4. Build for Production

```bash
npm run build
# or
yarn build

# Preview production build
npm run preview
```

## API Integration

The frontend communicates with the Django backend through REST API:

### Base URL
- Development: `http://localhost:8000`
- Production: Set via `VITE_API_URL` environment variable

### Authentication
- JWT tokens stored in localStorage
- Automatic token refresh on 401 errors
- Tokens included in all authenticated requests

### API Services

#### Auth Service (`auth.service.ts`)
- `login()` - User login
- `register()` - User registration
- `getCurrentUser()` - Get authenticated user
- `logout()` - Logout and clear tokens

#### Job Service (`job.service.ts`)
- `getJobs()` - List jobs with filters
- `getJob()` - Get single job
- `createJob()` - Create new job
- `updateJob()` - Update job
- `deleteJob()` - Delete job
- `closeJob()` / `reopenJob()` - Manage job status

#### Application Service (`application.service.ts`)
- `submitApplication()` - Submit application (multipart/form-data)
- `getApplications()` - List applications with filters
- `getApplication()` - Get single application
- `updateApplicationStatus()` - Change status
- `bulkUpdateStatus()` - Update multiple applications
- `getApplicationHistory()` - Get status history
- `reparseResume()` - Re-trigger parsing

## Page Routes

### Public Routes (No Authentication)
```
/                    - Job listings page
/jobs/:jobId/apply   - Application submission form
/login               - Login page
/register            - Registration page
```

### Protected Routes (Authentication Required)
```
/jobs/new            - Create new job
/jobs/:id/edit       - Edit job
/applications        - Applications dashboard (with filters)
/applications/:id    - Application detail page
```

## Key Features Explained

### 1. Authentication Flow
- Login → Store JWT tokens → Auto-refresh on expiry
- Protected routes redirect to `/login` if not authenticated
- Navigation updates based on auth status

### 2. File Upload
- React Dropzone for drag-and-drop
- Client-side validation (file type, size)
- FormData submission to Django backend
- Progress indication during upload

### 3. Filtering & Search
- URL query params for shareable filters
- Debounced search input (performance)
- Multiple filter combinations
- Real-time results update

### 4. Status Management
- Visual status badges with color coding
- One-click status changes
- Status history timeline
- Optimistic UI updates

### 5. Responsive Design
- Mobile-first approach with Tailwind CSS
- Responsive tables and cards
- Touch-friendly UI elements
- Clean, modern interface

## Deployment

### Option 1: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variable
vercel env add VITE_API_URL
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Set environment variable in Netlify dashboard
```

### Option 3: Railway
1. Connect GitHub repository
2. Set build command: `npm run build`
3. Set environment variable: `VITE_API_URL`
4. Auto-deploys on push

### Production Environment Variables
```
VITE_API_URL=https://your-backend-domain.com
```

## Testing

### Manual Testing Checklist

**Public Features:**
- [ ] View job listings
- [ ] Apply to a job with resume upload
- [ ] Receive confirmation after application

**Authentication:**
- [ ] Register new account
- [ ] Login with credentials
- [ ] Logout

**Recruiter Features:**
- [ ] Create new job posting
- [ ] Edit existing job
- [ ] Close/reopen job
- [ ] View all applications
- [ ] Filter applications by job/status
- [ ] Search applications
- [ ] View application details
- [ ] Change application status
- [ ] View status history
- [ ] Download resume

## Design Decisions

1. **Vite over Create React App** - Faster dev server, better performance
2. **Tailwind CSS** - Rapid development, consistent styling, small bundle
3. **Service Layer Pattern** - Clean separation of API logic
4. **Context for Auth** - Simple, built-in state management
5. **TypeScript** - Type safety, better IDE support, fewer bugs
6. **Protected Routes** - Security at routing level
7. **JWT in localStorage** - Simple, works across tabs
8. **Axios Interceptors** - Automatic token refresh, DRY error handling

## Assumptions

1. Single tenant (one company)
2. English language only
3. Desktop-first for recruiters, mobile-friendly for candidates
4. Modern browsers (ES6+ support)
5. Backend always available during development

## Future Enhancements

- Real-time notifications (WebSocket)
- Drag-and-drop Kanban board for status
- Advanced search with filters
- Bulk actions (select multiple applications)
- Email templates for candidates
- Calendar integration for interviews
- Analytics dashboard
- Export applications to CSV/PDF
- Collaborative notes on applications
- Interview scheduling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Common Issues & Solutions

### Issue: CORS Errors
**Solution**: Ensure Django backend has correct CORS_ALLOWED_ORIGINS in settings.py

### Issue: 401 Unauthorized
**Solution**: Check if access token is expired. The app should auto-refresh, but you may need to re-login.

### Issue: File Upload Fails
**Solution**: Check file size (<10MB) and type (PDF, DOC, DOCX only)

### Issue: Routes Not Working
**Solution**: Make sure backend is running on http://localhost:8000

## Development Tips

1. **Hot Reload**: Vite provides instant HMR
2. **TypeScript Errors**: Run `npm run build` to see all type errors
3. **Styling**: Use Tailwind's IntelliSense extension for VS Code
4. **Debugging**: React DevTools + Network tab are your friends

## Support

For issues or questions, contact: winston@ethronixlabs.com

## License

Proprietary - Ethronix Labs
