#!/bin/bash

# Test script for Resume Parser API

BASE_URL="http://localhost:8080"

echo "Testing Resume Parser API..."
echo ""

# Test 1: Health Check
echo "1. Testing health check..."
curl -s $BASE_URL/health | json_pp
echo ""
echo ""

# Test 2: Parse Resume (you'll need to update the file_url)
echo "2. Testing resume parsing..."
echo "Note: Update the file_url in this script with your actual resume URL"
echo ""

curl -s -X POST $BASE_URL/parse-resume \
  -H "Content-Type: application/json" \
  -d '{
    "file_url": "http://localhost:8000/media/resumes/2024/12/11/sample.pdf",
    "job_requirements": ["Python", "Django", "React", "PostgreSQL", "JavaScript"]
  }' | json_pp

echo ""
echo ""
echo "Testing complete!"
