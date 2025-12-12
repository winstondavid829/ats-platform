# Resume Parser Microservice - Golang

Golang microservice for parsing resumes (PDF/DOCX) and extracting candidate information.

## Features

✅ **PDF Parsing** - Extract text from PDF resumes
✅ **DOCX Parsing** - Extract text from Word documents
✅ **Skills Extraction** - Identify technical skills from resume text
✅ **Experience Detection** - Extract years of experience
✅ **Education Parsing** - Identify degrees and fields of study
✅ **Contact Extraction** - Extract email and phone number
✅ **Match Scoring** - Calculate candidate-job match score (0-100)
✅ **REST API** - Simple HTTP JSON API

## Tech Stack

- **Go 1.21+** - Programming language
- **Gin** - HTTP web framework
- **ledongthuc/pdf** - PDF parsing library
- **nguyenthenguyen/docx** - DOCX parsing library

## Project Structure

```
golang-service/
├── handlers/
│   └── resume_handler.go     # HTTP request handlers
├── models/
│   └── models.go              # Data structures
├── parsers/
│   ├── pdf_parser.go          # PDF parsing logic
│   ├── docx_parser.go         # DOCX parsing logic
│   ├── text_analyzer.go       # Text analysis & extraction
│   ├── resume_parser.go       # Main parser coordinator
│   └── utils.go               # Utility functions
├── main.go                    # Application entry point
├── go.mod                     # Go module definition
├── .env.example               # Environment variables template
└── README.md                  # This file
```

## API Endpoints

### POST /parse-resume
Parse a resume and extract information.

**Request Body:**
```json
{
  "file_url": "http://localhost:8000/media/resumes/2024/12/11/resume.pdf",
  "job_requirements": ["Python", "Django", "React", "PostgreSQL"]
}
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "skills": ["Python", "Django", "React", "PostgreSQL", "JavaScript", "SQL"],
    "experience": "5+ years",
    "education": "B.Sc in Computer Science",
    "email": "candidate@example.com",
    "phone": "+94771234567",
    "score": 85
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Failed to parse resume: unsupported file type"
}
```

### GET /health
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "service": "Resume Parser API",
  "version": "1.0.0"
}
```

## Setup Instructions

### Prerequisites
- Go 1.21 or higher
- Internet connection (for downloading dependencies)

### 1. Install Go

**Windows:**
Download from https://golang.org/dl/

**Mac:**
```bash
brew install go
```

**Linux:**
```bash
wget https://golang.org/dl/go1.21.5.linux-amd64.tar.gz
sudo tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz
export PATH=$PATH:/usr/local/go/bin
```

### 2. Clone and Setup

```bash
cd golang-service

# Download dependencies
go mod download

# Verify dependencies
go mod verify
```

### 3. Run Development Server

```bash
# Run directly
go run main.go

# Or build and run
go build -o resume-parser
./resume-parser
```

Server will start on `http://localhost:8080`

### 4. Test the API

```bash
# Health check
curl http://localhost:8080/health

# Parse resume
curl -X POST http://localhost:8080/parse-resume \
  -H "Content-Type: application/json" \
  -d '{
    "file_url": "http://localhost:8000/media/resumes/2024/12/11/resume.pdf",
    "job_requirements": ["Python", "Django", "React"]
  }'
```

## Building for Production

### Build Binary

```bash
# For current OS
go build -o resume-parser

# For Linux (from Windows/Mac)
GOOS=linux GOARCH=amd64 go build -o resume-parser-linux

# For Windows (from Linux/Mac)
GOOS=windows GOARCH=amd64 go build -o resume-parser.exe

# For Mac (from Windows/Linux)
GOOS=darwin GOARCH=amd64 go build -o resume-parser-mac
```

### Run Binary

```bash
# Linux/Mac
./resume-parser

# Windows
resume-parser.exe
```

## Configuration

### Environment Variables

Create a `.env` file (optional):

```bash
PORT=8080
GIN_MODE=release
```

Or set via command line:

```bash
# Linux/Mac
export PORT=8080
export GIN_MODE=release

# Windows
set PORT=8080
set GIN_MODE=release
```

## Deployment

### Option 1: Railway

1. Create Railway account
2. Create new project from GitHub
3. Railway auto-detects Go and deploys
4. Set environment variables in dashboard

### Option 2: Docker

Create `Dockerfile`:
```dockerfile
FROM golang:1.21-alpine

WORKDIR /app
COPY . .

RUN go mod download
RUN go build -o resume-parser

EXPOSE 8080
CMD ["./resume-parser"]
```

Build and run:
```bash
docker build -t resume-parser .
docker run -p 8080:8080 resume-parser
```

### Option 3: Heroku

Create `Procfile`:
```
web: ./resume-parser
```

Deploy:
```bash
heroku create ats-resume-parser
git push heroku main
```

### Option 4: DigitalOcean App Platform

1. Connect GitHub repository
2. Select Golang as runtime
3. Set build command: `go build -o resume-parser`
4. Set run command: `./resume-parser`
5. Deploy

## How It Works

### 1. File Download
Service downloads resume from provided URL to temporary file.

### 2. File Type Detection
Detects file type based on extension (.pdf or .docx).

### 3. Text Extraction
- **PDF:** Uses ledongthuc/pdf to extract text from all pages
- **DOCX:** Uses nguyenthenguyen/docx to extract document content

### 4. Information Extraction
- **Skills:** Matches against 100+ predefined technical skills
- **Experience:** Regex patterns to find "X years of experience"
- **Education:** Matches degree types and fields of study
- **Email:** Regex pattern for email addresses
- **Phone:** Regex patterns for various phone formats

### 5. Scoring Algorithm
```
Score = (Matched Skills / Total Required Skills) × 100
```

Example:
- Required: Python, Django, React, PostgreSQL (4 skills)
- Found: Python, Django, React, JavaScript (4 skills, 3 match)
- Score: (3/4) × 100 = 75%

## Extending the Parser

### Add More Skills

Edit `parsers/text_analyzer.go`:

```go
skillKeywords := []string{
    // Add your skills here
    "New Skill 1",
    "New Skill 2",
    // ...
}
```

### Improve Extraction

Modify regex patterns in `text_analyzer.go`:

```go
// Add new patterns
patterns := []string{
    `your-custom-pattern`,
    // ...
}
```

### Support More File Types

Add new parser in `parsers/` directory:

```go
type NewParser struct{}

func (p *NewParser) Parse(filePath string) (string, error) {
    // Your parsing logic
}
```

## Troubleshooting

### Issue 1: "go: cannot find main module"

**Solution:**
```bash
go mod init github.com/ats-platform/resume-parser
go mod tidy
```

### Issue 2: Dependencies not downloading

**Solution:**
```bash
go clean -modcache
go mod download
```

### Issue 3: "Failed to download file"

**Check:**
- File URL is accessible
- Django backend is running
- CORS is properly configured

### Issue 4: "No text content found"

**Possible causes:**
- PDF is image-based (scanned document)
- DOCX is corrupted
- File format not supported

### Issue 5: Port 8080 already in use

**Solution:**
```bash
# Use different port
PORT=8081 go run main.go
```

## Testing

### Manual Testing

```bash
# 1. Start the service
go run main.go

# 2. Test health check
curl http://localhost:8080/health

# 3. Test with sample resume
curl -X POST http://localhost:8080/parse-resume \
  -H "Content-Type: application/json" \
  -d '{
    "file_url": "http://example.com/resume.pdf",
    "job_requirements": ["Python", "Django"]
  }'
```

### Integration Testing

Ensure Django backend is running, then:

```bash
# Submit application via Django API
# Django will automatically call Golang service
```

## Performance

- **Parsing Speed:** ~1-2 seconds per resume
- **Memory Usage:** ~50-100MB
- **Concurrent Requests:** Supports multiple simultaneous requests
- **File Size Limit:** Recommended max 10MB per file

## Limitations

1. **Image-based PDFs:** Cannot extract text from scanned documents (OCR not implemented)
2. **Complex Layouts:** May miss information in unusual resume formats
3. **Language:** Optimized for English resumes
4. **Skills Database:** Limited to predefined skills list

## Future Enhancements

- OCR support for scanned PDFs
- Multi-language support
- Machine learning-based extraction
- Resume quality scoring
- Duplicate detection
- Batch processing
- Caching layer
- Database integration

## Logging

Logs are written to stdout with timestamps:

```
2024/12/11 10:30:00 Starting Resume Parser Service...
2024/12/11 10:30:00 Server starting on port 8080
2024/12/11 10:30:15 Parsing resume from URL: http://...
2024/12/11 10:30:17 Successfully parsed resume. Score: 85, Skills: [Python Django React]
```

## Security Considerations

1. **File Validation:** Service only accepts PDF and DOCX files
2. **Download Timeout:** 30-second timeout prevents hanging
3. **Temporary Files:** Automatically deleted after parsing
4. **No Persistence:** No files are permanently stored
5. **CORS:** Enabled for cross-origin requests

## Support

For issues or questions:
- Email: winston@ethronixlabs.com
- GitHub Issues: (your-repo-url)

## License

Proprietary - Ethronix Labs

## Version History

- **v1.0.0** (2024-12-11) - Initial release
  - PDF and DOCX parsing
  - Skills, experience, education extraction
  - Match scoring algorithm
  - REST API with Gin
