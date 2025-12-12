package parsers

import (
	"fmt"
	"io"
	"os"

	"github.com/ledongthuc/pdf"
)

// PDFParser handles PDF file parsing
type PDFParser struct{}

// NewPDFParser creates a new PDF parser
func NewPDFParser() *PDFParser {
	return &PDFParser{}
}

// Parse extracts text from PDF file
func (p *PDFParser) Parse(filePath string) (string, error) {
	// Open PDF file
	file, reader, err := pdf.Open(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to open PDF: %w", err)
	}
	defer file.Close()

	// Extract text from all pages
	var text string
	totalPages := reader.NumPage()

	for pageNum := 1; pageNum <= totalPages; pageNum++ {
		page := reader.Page(pageNum)
		if page.V.IsNull() {
			continue
		}

		pageText, err := page.GetPlainText(nil)
		if err != nil {
			// Try to continue with other pages
			continue
		}

		text += pageText + "\n"
	}

	if text == "" {
		return "", fmt.Errorf("no text content found in PDF")
	}

	return text, nil
}

// ParseFromReader extracts text from PDF reader
func (p *PDFParser) ParseFromReader(reader io.ReaderAt, size int64) (string, error) {
	pdfReader, err := pdf.NewReader(reader, size)
	if err != nil {
		return "", fmt.Errorf("failed to create PDF reader: %w", err)
	}

	var text string
	totalPages := pdfReader.NumPage()

	for pageNum := 1; pageNum <= totalPages; pageNum++ {
		page := pdfReader.Page(pageNum)
		if page.V.IsNull() {
			continue
		}

		pageText, err := page.GetPlainText(nil)
		if err != nil {
			continue
		}

		text += pageText + "\n"
	}

	if text == "" {
		return "", fmt.Errorf("no text content found in PDF")
	}

	return text, nil
}

// DownloadAndParse downloads PDF from URL and parses it
func (p *PDFParser) DownloadAndParse(url string) (string, error) {
	// Create temporary file
	tmpFile, err := os.CreateTemp("", "resume-*.pdf")
	if err != nil {
		return "", fmt.Errorf("failed to create temp file: %w", err)
	}
	defer os.Remove(tmpFile.Name())
	defer tmpFile.Close()

	// Download file
	if err := downloadFile(url, tmpFile.Name()); err != nil {
		return "", fmt.Errorf("failed to download file: %w", err)
	}

	// Parse PDF
	return p.Parse(tmpFile.Name())
}
