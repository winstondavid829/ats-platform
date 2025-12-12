package parsers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"
)

// downloadFile downloads a file from URL to local path
func downloadFile(url, filepath string) error {
	// Create HTTP client with timeout
	client := &http.Client{
		Timeout: 30 * time.Second,
	}

	// Get the file
	resp, err := client.Get(url)
	if err != nil {
		return fmt.Errorf("failed to download file: %w", err)
	}
	defer resp.Body.Close()

	// Check response status
	if resp.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %s", resp.Status)
	}

	// Create the file
	out, err := os.Create(filepath)
	if err != nil {
		return fmt.Errorf("failed to create file: %w", err)
	}
	defer out.Close()

	// Write the body to file
	_, err = io.Copy(out, resp.Body)
	if err != nil {
		return fmt.Errorf("failed to write file: %w", err)
	}

	return nil
}

// getFileExtension returns the file extension from URL or path
func getFileExtension(fileURL string) string {
	// Remove query parameters
	if idx := strings.Index(fileURL, "?"); idx != -1 {
		fileURL = fileURL[:idx]
	}
	
	ext := strings.ToLower(filepath.Ext(fileURL))
	return ext
}

// detectFileType detects if file is PDF or DOCX based on URL
func detectFileType(fileURL string) string {
	ext := getFileExtension(fileURL)
	
	switch ext {
	case ".pdf":
		return "pdf"
	case ".doc", ".docx":
		return "docx"
	default:
		return "unknown"
	}
}
