package models

// ParseResumeRequest represents the request body for resume parsing
type ParseResumeRequest struct {
	FileURL         string   `json:"file_url" binding:"required"`
	JobRequirements []string `json:"job_requirements"`
}

// ParsedData represents the extracted information from resume
type ParsedData struct {
	Skills     []string `json:"skills"`
	Experience string   `json:"experience"`
	Education  string   `json:"education"`
	Email      string   `json:"email"`
	Phone      string   `json:"phone"`
	Score      int      `json:"score"`
}

// ParseResumeResponse represents the response body
type ParseResumeResponse struct {
	Success bool        `json:"success"`
	Data    *ParsedData `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// HealthCheckResponse represents health check response
type HealthCheckResponse struct {
	Status  string `json:"status"`
	Service string `json:"service"`
	Version string `json:"version"`
}
