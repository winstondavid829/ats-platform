package parsers

import (
	"fmt"

	"github.com/ats-platform/resume-parser/models"
)

// ResumeParser is the main parser that coordinates all parsing operations
type ResumeParser struct {
	pdfParser   *PDFParser
	docxParser  *DOCXParser
	analyzer    *TextAnalyzer
}

// NewResumeParser creates a new resume parser
func NewResumeParser() *ResumeParser {
	return &ResumeParser{
		pdfParser:  NewPDFParser(),
		docxParser: NewDOCXParser(),
		analyzer:   NewTextAnalyzer(),
	}
}

// ParseResume parses a resume from URL and returns extracted data
func (r *ResumeParser) ParseResume(fileURL string, jobRequirements []string) (*models.ParsedData, error) {
	// Detect file type
	fileType := detectFileType(fileURL)
	
	var text string
	var err error

	// Parse based on file type
	switch fileType {
	case "pdf":
		text, err = r.pdfParser.DownloadAndParse(fileURL)
	case "docx":
		text, err = r.docxParser.DownloadAndParse(fileURL)
	default:
		return nil, fmt.Errorf("unsupported file type: %s (must be PDF or DOCX)", fileType)
	}

	if err != nil {
		return nil, fmt.Errorf("failed to parse resume: %w", err)
	}

	if text == "" {
		return nil, fmt.Errorf("no text content extracted from resume")
	}

	// Extract information
	skills := r.analyzer.ExtractSkills(text)
	experience := r.analyzer.ExtractExperience(text)
	education := r.analyzer.ExtractEducation(text)
	email := r.analyzer.ExtractEmail(text)
	phone := r.analyzer.ExtractPhone(text)
	score := r.analyzer.CalculateScore(skills, jobRequirements)

	// Return parsed data
	return &models.ParsedData{
		Skills:     skills,
		Experience: experience,
		Education:  education,
		Email:      email,
		Phone:      phone,
		Score:      score,
	}, nil
}
