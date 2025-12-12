@echo off
REM Test script for Resume Parser API (Windows)

set BASE_URL=http://localhost:8080

echo Testing Resume Parser API...
echo.

REM Test 1: Health Check
echo 1. Testing health check...
curl -s %BASE_URL%/health
echo.
echo.

REM Test 2: Parse Resume
echo 2. Testing resume parsing...
echo Note: Update the file_url with your actual resume URL
echo.

curl -s -X POST %BASE_URL%/parse-resume ^
  -H "Content-Type: application/json" ^
  -d "{\"file_url\": \"http://localhost:8000/media/resumes/2024/12/11/sample.pdf\", \"job_requirements\": [\"Python\", \"Django\", \"React\", \"PostgreSQL\"]}"

echo.
echo.
echo Testing complete!
pause
