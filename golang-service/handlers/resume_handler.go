package handlers

import (
	"log"
	"net/http"

	"github.com/ats-platform/resume-parser/models"
	"github.com/ats-platform/resume-parser/parsers"
	"github.com/gin-gonic/gin"
)

// ResumeHandler handles resume parsing requests
type ResumeHandler struct {
	parser *parsers.ResumeParser
}

// NewResumeHandler creates a new resume handler
func NewResumeHandler() *ResumeHandler {
	return &ResumeHandler{
		parser: parsers.NewResumeParser(),
	}
}

// ParseResume handles POST /parse-resume
func (h *ResumeHandler) ParseResume(c *gin.Context) {
	var req models.ParseResumeRequest

	// Bind JSON request
	if err := c.ShouldBindJSON(&req); err != nil {
		log.Printf("Invalid request: %v", err)
		c.JSON(http.StatusBadRequest, models.ParseResumeResponse{
			Success: false,
			Error:   "Invalid request body: " + err.Error(),
		})
		return
	}

	log.Printf("Parsing resume from URL: %s", req.FileURL)
	log.Printf("Job requirements: %v", req.JobRequirements)

	// Parse resume
	data, err := h.parser.ParseResume(req.FileURL, req.JobRequirements)
	if err != nil {
		log.Printf("Failed to parse resume: %v", err)
		c.JSON(http.StatusInternalServerError, models.ParseResumeResponse{
			Success: false,
			Error:   "Failed to parse resume: " + err.Error(),
		})
		return
	}

	log.Printf("Successfully parsed resume. Score: %d, Skills: %v", data.Score, data.Skills)

	// Return success response
	c.JSON(http.StatusOK, models.ParseResumeResponse{
		Success: true,
		Data:    data,
	})
}

// HealthCheck handles GET /health
func (h *ResumeHandler) HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, models.HealthCheckResponse{
		Status:  "healthy",
		Service: "Resume Parser API",
		Version: "1.0.0",
	})
}
