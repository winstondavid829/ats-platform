package parsers

import (
	"regexp"
	"strings"
)

// TextAnalyzer analyzes resume text and extracts information
type TextAnalyzer struct{}

// NewTextAnalyzer creates a new text analyzer
func NewTextAnalyzer() *TextAnalyzer {
	return &TextAnalyzer{}
}

// ExtractSkills extracts skills from resume text
func (a *TextAnalyzer) ExtractSkills(text string) []string {
	// Common technical skills (expand this list based on your needs)
	skillKeywords := []string{
		// Programming Languages
		"Python", "Java", "JavaScript", "TypeScript", "Go", "Golang", "C++", "C#",
		"Ruby", "PHP", "Swift", "Kotlin", "Rust", "Scala", "R", "MATLAB",

		// Web Technologies
		"HTML", "CSS", "React", "Angular", "Vue", "Node.js", "Express",
		"Django", "Flask", "FastAPI", "Spring", "ASP.NET", "jQuery",

		// Databases
		"SQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "Oracle",
		"SQL Server", "MariaDB", "Cassandra", "DynamoDB", "SQLite",

		// Cloud & DevOps
		"AWS", "Azure", "GCP", "Docker", "Kubernetes", "Jenkins",
		"Git", "GitHub", "GitLab", "CI/CD", "Terraform", "Ansible",

		// Data Science & ML
		"Machine Learning", "Deep Learning", "TensorFlow", "PyTorch",
		"scikit-learn", "Pandas", "NumPy", "Data Analysis", "NLP",

		// Mobile Development
		"Android", "iOS", "React Native", "Flutter", "Xamarin",

		// Other
		"REST API", "GraphQL", "Microservices", "Agile", "Scrum",
		"Linux", "Unix", "Windows Server", "Networking", "Security",
	}

	foundSkills := make(map[string]bool)
	textLower := strings.ToLower(text)

	for _, skill := range skillKeywords {
		skillLower := strings.ToLower(skill)
		if strings.Contains(textLower, skillLower) {
			foundSkills[skill] = true
		}
	}

	// Convert map to slice
	skills := make([]string, 0, len(foundSkills))
	for skill := range foundSkills {
		skills = append(skills, skill)
	}

	return skills
}

// ExtractExperience attempts to extract years of experience
func (a *TextAnalyzer) ExtractExperience(text string) string {
	// Patterns to match experience
	patterns := []string{
		`(\d+)\+?\s*years?\s+(?:of\s+)?experience`,
		`experience:\s*(\d+)\+?\s*years?`,
		`(\d+)\+?\s*years?\s+(?:in|of|with)`,
	}

	for _, pattern := range patterns {
		re := regexp.MustCompile(`(?i)` + pattern)
		matches := re.FindStringSubmatch(text)
		if len(matches) > 1 {
			years := matches[1]
			if years == "1" {
				return "1 year"
			}
			return years + "+ years"
		}
	}

	return ""
}

// ExtractEducation attempts to extract education information
func (a *TextAnalyzer) ExtractEducation(text string) string {
	// Common education keywords and patterns
	degrees := []string{
		"Ph.D", "PhD", "Doctor of Philosophy",
		"Master", "M.S", "M.Sc", "MBA", "M.A",
		"Bachelor", "B.S", "B.Sc", "B.A", "B.E", "B.Tech",
		"Associate", "Diploma",
	}

	fields := []string{
		"Computer Science", "Software Engineering", "Information Technology",
		"Engineering", "Mathematics", "Physics", "Business Administration",
		"Data Science", "Artificial Intelligence",
	}

	textLower := strings.ToLower(text)
	
	// Find degree
	var foundDegree string
	for _, degree := range degrees {
		if strings.Contains(textLower, strings.ToLower(degree)) {
			foundDegree = degree
			break
		}
	}

	// Find field
	var foundField string
	for _, field := range fields {
		if strings.Contains(textLower, strings.ToLower(field)) {
			foundField = field
			break
		}
	}

	// Combine results
	if foundDegree != "" && foundField != "" {
		return foundDegree + " in " + foundField
	} else if foundDegree != "" {
		return foundDegree
	} else if foundField != "" {
		return "Degree in " + foundField
	}

	return ""
}

// ExtractEmail extracts email address from text
func (a *TextAnalyzer) ExtractEmail(text string) string {
	emailRegex := regexp.MustCompile(`[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}`)
	emails := emailRegex.FindAllString(text, -1)
	
	if len(emails) > 0 {
		return emails[0] // Return first email found
	}
	
	return ""
}

// ExtractPhone extracts phone number from text
func (a *TextAnalyzer) ExtractPhone(text string) string {
	// Patterns for different phone formats
	patterns := []string{
		`\+?\d{1,3}[\s-]?\(?\d{2,3}\)?[\s-]?\d{3,4}[\s-]?\d{4}`,  // International and local
		`\(\d{3}\)\s*\d{3}[-\s]?\d{4}`,                            // (123) 456-7890
		`\d{3}[-\s]?\d{3}[-\s]?\d{4}`,                             // 123-456-7890
	}

	for _, pattern := range patterns {
		re := regexp.MustCompile(pattern)
		phones := re.FindAllString(text, -1)
		if len(phones) > 0 {
			return phones[0]
		}
	}

	return ""
}

// CalculateScore calculates match score based on job requirements
func (a *TextAnalyzer) CalculateScore(skills []string, requirements []string) int {
	if len(requirements) == 0 {
		return 50 // Default score if no requirements
	}

	matchCount := 0
	skillsLower := make(map[string]bool)
	
	// Convert skills to lowercase map for case-insensitive matching
	for _, skill := range skills {
		skillsLower[strings.ToLower(strings.TrimSpace(skill))] = true
	}

	// Check each requirement
	for _, req := range requirements {
		reqLower := strings.ToLower(strings.TrimSpace(req))
		
		// Direct match
		if skillsLower[reqLower] {
			matchCount++
			continue
		}
		
		// Partial match (requirement contains skill or vice versa)
		for skill := range skillsLower {
			if strings.Contains(skill, reqLower) || strings.Contains(reqLower, skill) {
				matchCount++
				break
			}
		}
	}

	// Calculate percentage score (0-100)
	score := int(float64(matchCount) / float64(len(requirements)) * 100)
	
	// Ensure score is between 0 and 100
	if score > 100 {
		score = 100
	}
	
	return score
}
