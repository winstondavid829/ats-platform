package parsers

import (
	"fmt"
	"os"
	"strings"

	"github.com/nguyenthenguyen/docx"
)

// DOCXParser handles DOCX file parsing
type DOCXParser struct{}

// NewDOCXParser creates a new DOCX parser
func NewDOCXParser() *DOCXParser {
	return &DOCXParser{}
}

// Parse extracts text from DOCX file
func (d *DOCXParser) Parse(filePath string) (string, error) {
	// Read DOCX file
	doc, err := docx.ReadDocxFile(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to read DOCX: %w", err)
	}
	defer doc.Close()

	// Extract text
	docx := doc.Editable()
	text := docx.GetContent()

	if text == "" {
		return "", fmt.Errorf("no text content found in DOCX")
	}

	return text, nil
}

// DownloadAndParse downloads DOCX from URL and parses it
func (d *DOCXParser) DownloadAndParse(url string) (string, error) {
	// Create temporary file
	tmpFile, err := os.CreateTemp("", "resume-*.docx")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tmpFile.Name())
	defer tmpFile.Close()

	// Download file
	if err := downloadFile(url, tmpFile.Name()); err != nil {
		return "", fmt.Errorf("failed to download file: %w", err)
	}

	// Parse DOCX
	return d.Parse(tmpFile.Name())
}

// ParseText extracts clean text from DOCX content
func (d *DOCXParser) ParseText(content string) string {
	// Remove excessive whitespace
	lines := strings.Split(content, "\n")
	var cleanLines []string

	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line != "" {
			cleanLines = append(cleanLines, line)
		}
	}

	return strings.Join(cleanLines, "\n")
}
