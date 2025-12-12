import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { applicationService } from '../services/application.service';
import { Application, ApplicationStatus, STATUS_LABELS } from '../types';
import { formatDateTime, getErrorMessage } from '../utils/helpers';

const ApplicationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadApplication();
  }, [id]);

  const loadApplication = async () => {
    setLoading(true);
    try {
      const data = await applicationService.getApplication(Number(id));
      setApplication(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application) return;

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await applicationService.updateApplicationStatus(application.id, newStatus);
      setSuccess('Status updated successfully');
      await loadApplication(); // Reload to get updated history
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdating(false);
    }
  };

  const handleReparse = async () => {
    if (!application) return;

    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await applicationService.reparseResume(application.id);
      setSuccess('Resume re-parsing triggered');
      await loadApplication();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setUpdating(false);
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

  if (!application) {
    return (
      <Layout>
        <div className="text-center py-12">
          <p className="text-gray-500">Application not found</p>
          <Button className="mt-4" onClick={() => navigate('/applications')}>
            Back to Applications
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <button
            onClick={() => navigate('/applications')}
            className="text-sm text-gray-600 hover:text-gray-900 mb-4"
          >
            ← Back to Applications
          </button>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {application.candidate_name}
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                Applied for: {application.job.title}
              </p>
            </div>
            <StatusBadge status={application.status} />
          </div>
        </div>

        {/* Success/Error messages */}
        {success && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}
        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Main info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Candidate Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Candidate Information
              </h2>
              <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {application.candidate_email}
                  </dd>
                </div>
                {application.candidate_phone && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Phone</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {application.candidate_phone}
                    </dd>
                  </div>
                )}
                {application.linkedin_url && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-gray-500">LinkedIn</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      <a
                        href={application.linkedin_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        {application.linkedin_url}
                      </a>
                    </dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Applied On</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatDateTime(application.applied_at)}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Cover Letter */}
            {application.cover_letter && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Cover Letter
                </h2>
                <p className="text-sm text-gray-700 whitespace-pre-line">
                  {application.cover_letter}
                </p>
              </div>
            )}

            {/* Parsed Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Resume Analysis
                </h2>
                <Button size="sm" onClick={handleReparse} loading={updating}>
                  Re-parse Resume
                </Button>
              </div>

              <dl className="grid grid-cols-1 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Match Score</dt>
                  <dd className="mt-1">
                    <div className="flex items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-primary-600 h-2 rounded-full"
                          style={{ width: `${application.score}%` }}
                        />
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-900">
                        {application.score}%
                      </span>
                    </div>
                  </dd>
                </div>

                {application.parsed_skills.length > 0 && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Skills</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {application.parsed_skills.map((skill, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                        >
                          {skill}
                        </span>
                      ))}
                    </dd>
                  </div>
                )}

                {application.parsed_experience && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Experience</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {application.parsed_experience}
                    </dd>
                  </div>
                )}

                {application.parsed_education && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Education</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {application.parsed_education}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Resume Download */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Resume</h2>
              <a
                href={application.resume_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Resume
              </a>
            </div>
          </div>

          {/* Right column - Actions & History */}
          <div className="space-y-6">
            {/* Change Status */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Change Status
              </h2>
              <div className="space-y-2">
                {Object.entries(STATUS_LABELS).map(([status, label]) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status as ApplicationStatus)}
                    disabled={updating || application.status === status}
                    className={`w-full text-left px-4 py-2 text-sm rounded-md transition-colors ${
                      application.status === status
                        ? 'bg-primary-100 text-primary-800 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status History */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Status History
              </h2>
              {application.status_history.length === 0 ? (
                <p className="text-sm text-gray-500">No status changes yet</p>
              ) : (
                <div className="flow-root">
                  <ul className="-mb-8">
                    {application.status_history.map((history, index) => (
                      <li key={history.id}>
                        <div className="relative pb-8">
                          {index !== application.status_history.length - 1 && (
                            <span
                              className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center ring-8 ring-white">
                                <svg
                                  className="h-5 w-5 text-primary-600"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div>
                                <p className="text-sm text-gray-900">
                                  {STATUS_LABELS[history.from_status as ApplicationStatus]} →{' '}
                                  <span className="font-medium">
                                    {STATUS_LABELS[history.to_status as ApplicationStatus]}
                                  </span>
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {history.changed_by_name} •{' '}
                                  {formatDateTime(history.changed_at)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ApplicationDetailPage;
