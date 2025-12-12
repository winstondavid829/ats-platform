import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import Button from '../components/Button';
import Input from '../components/Input';
import { jobService } from '../services/job.service';
import { JobFormData } from '../types';
import { getErrorMessage } from '../utils/helpers';

const JobFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requirements: '',
    location: '',
    salary_min: '',
    salary_max: '',
    status: 'active',
  });
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEdit) {
      loadJob();
    }
  }, [id]);

  const loadJob = async () => {
    try {
      const job = await jobService.getJob(Number(id));
      setFormData({
        title: job.title,
        description: job.description,
        requirements: job.requirements,
        location: job.location,
        salary_min: job.salary_min || '',
        salary_max: job.salary_max || '',
        status: job.status,
      });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setFieldErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFieldErrors({});

    try {
      if (isEdit) {
        await jobService.updateJob(Number(id), formData);
      } else {
        await jobService.createJob(formData);
      }
      navigate('/');
    } catch (err: any) {
      if (err.response?.data && typeof err.response.data === 'object') {
        setFieldErrors(err.response.data);
      } else {
        setError(getErrorMessage(err));
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
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

        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {isEdit ? 'Edit Job' : 'Post New Job'}
            </h1>

            {error && (
              <div className="mb-6 rounded-md bg-red-50 p-4">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Job Title *"
                name="title"
                type="text"
                required
                fullWidth
                placeholder="e.g., Senior Python Developer"
                value={formData.title}
                onChange={handleChange}
                error={fieldErrors.title}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description *
                </label>
                <textarea
                  name="description"
                  rows={6}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="Describe the role, responsibilities, and what makes it exciting..."
                  value={formData.description}
                  onChange={handleChange}
                />
                {fieldErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.description}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements *
                </label>
                <textarea
                  name="requirements"
                  rows={6}
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="List required skills, qualifications, and experience (one per line or comma-separated)"
                  value={formData.requirements}
                  onChange={handleChange}
                />
                {fieldErrors.requirements && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.requirements}</p>
                )}
              </div>

              <Input
                label="Location *"
                name="location"
                type="text"
                required
                fullWidth
                placeholder="e.g., Colombo, Remote"
                value={formData.location}
                onChange={handleChange}
                error={fieldErrors.location}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Minimum Salary (LKR)"
                  name="salary_min"
                  type="number"
                  fullWidth
                  placeholder="100000"
                  value={formData.salary_min}
                  onChange={handleChange}
                  error={fieldErrors.salary_min}
                />

                <Input
                  label="Maximum Salary (LKR)"
                  name="salary_max"
                  type="number"
                  fullWidth
                  placeholder="200000"
                  value={formData.salary_max}
                  onChange={handleChange}
                  error={fieldErrors.salary_max}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  name="status"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active (Accepting Applications)</option>
                  <option value="closed">Closed (Not Accepting Applications)</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => navigate('/')}
                >
                  Cancel
                </Button>
                <Button type="submit" loading={loading}>
                  {isEdit ? 'Update Job' : 'Post Job'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default JobFormPage;
