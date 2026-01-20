'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Save, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Language, RegistrationStatus } from '@/types/registration';

interface Registration {
  _id: string;
  name: string;
  email: string;
  language: string;
  programName: string;
  agencyName?: string;
  isNYCPSStaff: boolean;
  status: string;
  sessionId: string;
  emailSent: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditRegistrationPage({ params }: PageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resolvedParams = use(params);
  const registrationId = resolvedParams.id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    language: Language.ENGLISH,
    agencyName: '',
    isNYCPSStaff: false,
    status: RegistrationStatus.CONFIRMED,
    emailSent: false,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
      } catch (error) {
        router.push('/admin/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  // Fetch registration data
  const { data: registration, isLoading, error } = useQuery<Registration>({
    queryKey: ['registration', registrationId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/registrations/${registrationId}`);
      if (!response.ok) throw new Error('Failed to fetch registration');
      return response.json();
    },
    enabled: isAuthenticated && !!registrationId,
  });

  // Update form data when registration is loaded
  useEffect(() => {
    if (registration) {
      setFormData({
        name: registration.name,
        email: registration.email,
        language: registration.language as Language,
        agencyName: registration.agencyName || '',
        isNYCPSStaff: registration.isNYCPSStaff,
        status: registration.status as RegistrationStatus,
        emailSent: registration.emailSent || false,
      });
    }
  }, [registration]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`/api/admin/registrations/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update registration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registration', registrationId] });
      queryClient.invalidateQueries({ queryKey: ['admin-registrations'] });
      router.push('/admin');
    },
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/registrations/${registrationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete registration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-registrations'] });
      router.push('/admin');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this registration? This action cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-blue-700 dark:text-blue-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-blue-700 dark:text-blue-300">Loading registration...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center space-y-4">
          <p className="text-red-700 dark:text-red-300">Error loading registration</p>
          <Link
            href="/admin"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/img/asterisk.png"
          alt="Background Pattern"
          fill
          className="object-cover opacity-10"
          priority
        />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors group mb-6"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              Back to Admin Dashboard
            </Link>
            
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 dark:text-blue-200 mb-2">
              Edit Registration
            </h1>
            <p className="text-lg text-blue-600 dark:text-blue-400">
              Update registration details
            </p>
          </div>

          {/* Form */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-blue-200 dark:border-blue-800">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* Language */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Language *
                </label>
                <select
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value as Language })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                >
                  {Object.values(Language).map((lang) => (
                    <option key={lang} value={lang}>
                      {lang.replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Agency Name */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Agency Name
                </label>
                <input
                  type="text"
                  value={formData.agencyName}
                  onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* NYCPS Staff */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNYCPSStaff}
                    onChange={(e) => setFormData({ ...formData, isNYCPSStaff: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    NYCPS Staff Member
                  </span>
                </label>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Status *
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as RegistrationStatus })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                >
                  {Object.values(RegistrationStatus).map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Email Sent */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailSent}
                    onChange={(e) => setFormData({ ...formData, emailSent: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Email Sent
                  </span>
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Check this box if a confirmation email has been sent to the registrant
                </p>
              </div>

              {/* Program Name (Read-only) */}
              {registration && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Program Name
                  </label>
                  <input
                    type="text"
                    value={registration.programName}
                    disabled
                    className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 cursor-not-allowed"
                  />
                </div>
              )}

              {/* Error Message */}
              {(updateMutation.error || deleteMutation.error) && (
                <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {updateMutation.error?.message || deleteMutation.error?.message}
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <X className="w-5 h-5" />
                      Delete
                    </>
                  )}
                </button>
                <Link
                  href="/admin"
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
