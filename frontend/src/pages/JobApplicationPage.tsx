import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import { jobService } from '../services/job.service';
import { applicationService } from '../services/application.service';
import { Job } from '../types';
import { formatSalary, getErrorMessage } from '../utils/helpers';

const JobApplicationPage = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    candidate_name: '',
    candidate_email: '',
    candidate_phone: '',
    linkedin_url: '',
    cover_letter: '',
  });
  const [resume, setResume] = useState<File | null>(null);

  // File dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10485760, // 10MB
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setResume(acceptedFiles[0]);
      }
    },
  });

  useEffect(() => {
    loadJob();
  }, [jobId]);

  const loadJob = async () => {
    try {
      const data = await jobService.getJob(Number(jobId));
      setJob(data);
      
      if (data.status !== 'active') {
        setError('This job posting is no longer accepting applications.');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!resume) {
      setError('Please upload your resume');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await applicationService.submitApplication({
        job_id: Number(jobId),
        ...formData,
        resume_file: resume,
      });
      setSuccess(true);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6 text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">Application Submitted!</h3>
              <p className="mt-2 text-sm text-gray-500">
                Thank you for applying to {job?.title}. We've received your application and will
                review it shortly.
              </p>
              <div className="mt-6">
                <Button onClick={() => navigate('/')}>
                  Back to Jobs
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            ← Back to Jobs
          </button>
        </div>

        {/* Job details */}
        {job && (
          <div className="bg-white shadow sm:rounded-lg mb-8">
            <div className="px-4 py-5 sm:p-6">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <p className="mt-2 text-sm text-gray-600">{job.location}</p>
              <p className="mt-4 text-gray-700">{job.description}</p>
              <div className="mt-4 space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Salary:</span> {formatSalary(job.salary_min, job.salary_max)}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Requirements:</span>
                </p>
                <p className="text-sm text-gray-700 whitespace-pre-line">{job.requirements}</p>
              </div>
            </div>
          </div>
        )}

        {/* Application form */}
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Apply for this Position</h2>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Full Name *"
                name="candidate_name"
                type="text"
                required
                fullWidth
                value={formData.candidate_name}
                onChange={handleChange}
              />

              <Input
                label="Email Address *"
                name="candidate_email"
                type="email"
                required
                fullWidth
                value={formData.candidate_email}
                onChange={handleChange}
              />

              <Input
                label="Phone Number"
                name="candidate_phone"
                type="tel"
                fullWidth
                value={formData.candidate_phone}
                onChange={handleChange}
              />

              <Input
                label="LinkedIn Profile"
                name="linkedin_url"
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                fullWidth
                value={formData.linkedin_url}
                onChange={handleChange}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cover Letter
                </label>
                <textarea
                  name="cover_letter"
                  rows={6}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Tell us why you're a great fit for this role..."
                  value={formData.cover_letter}
                  onChange={handleChange}
                />
              </div>

              {/* Resume upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Resume * (PDF, DOC, or DOCX - Max 10MB)
                </label>
                <div
                  {...getRootProps()}
                  className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer ${
                    isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="space-y-1 text-center">
                    <input {...getInputProps()} />
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="text-sm text-gray-600">
                      {resume ? (
                        <p className="font-medium text-primary-600">{resume.name}</p>
                      ) : (
                        <>
                          <p>
                            <span className="font-medium text-primary-600">Upload a file</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 10MB</p>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={!job || job.status !== 'active'}
                >
                  Submit Application
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobApplicationPage;
