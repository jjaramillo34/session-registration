'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { RegistrationStatus } from '@/types/registration';
import { formatDate, formatTimeRange } from '@/lib/utils';

interface CrawlRegistrationDetail {
  _id: string;
  name: string;
  email: string;
  status: string;
  emailSent: boolean;
  crawlId: string | null;
  crawlName: string;
  crawlLocation: string;
  crawlAddress: string;
  crawlDate: string;
  crawlTime: string;
  crawlEndTime?: string;
  createdAt: string;
  updatedAt: string;
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditCrawlRegistrationPage({ params }: PageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resolvedParams = use(params);
  const registrationId = resolvedParams.id;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    status: RegistrationStatus.CONFIRMED,
    emailSent: false,
  });

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) setIsAuthenticated(true);
        else router.push('/admin/login');
      } catch {
        router.push('/admin/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };
    checkAuth();
  }, [router]);

  const { data: registration, isLoading, error } = useQuery<CrawlRegistrationDetail>({
    queryKey: ['crawl-registration', registrationId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/crawl-registrations/${registrationId}`);
      if (!response.ok) throw new Error('Failed to fetch crawl registration');
      return response.json();
    },
    enabled: isAuthenticated && !!registrationId,
  });

  useEffect(() => {
    if (registration) {
      setFormData({
        name: registration.name,
        email: registration.email,
        status: registration.status as RegistrationStatus,
        emailSent: registration.emailSent ?? false,
      });
    }
  }, [registration]);

  const updateMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch(`/api/admin/crawl-registrations/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crawl-registration', registrationId] });
      queryClient.invalidateQueries({ queryKey: ['admin-crawl-registrations'] });
      router.push('/admin');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/admin/crawl-registrations/${registrationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to delete');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-crawl-registrations'] });
      router.push('/admin');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this crawl registration? This cannot be undone.')) {
      deleteMutation.mutate();
    }
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" />
          <p className="text-blue-700 dark:text-blue-300">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" />
          <p className="text-blue-700 dark:text-blue-300">Loading crawl registration...</p>
        </div>
      </div>
    );
  }

  if (error || !registration) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center space-y-4">
          <p className="text-red-700 dark:text-red-300">Error loading crawl registration</p>
          <Link href="/admin" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image src="/img/asterisk.png" alt="" fill className="object-cover opacity-10" priority />
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors group mb-6"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1" />
              Back to Admin Dashboard
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-blue-800 dark:text-blue-200 mb-2">
              Edit Crawl Registration
            </h1>
            <p className="text-lg text-blue-600 dark:text-blue-400">
              Update name, email, status, or email-sent flag
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 border-2 border-blue-200 dark:border-blue-800">
            {/* Read-only crawl info */}
            <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                Site crawl (read-only)
              </h2>
              <p className="font-semibold text-gray-900 dark:text-white">{registration.crawlName || '-'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{registration.crawlAddress || '-'}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {registration.crawlDate ? formatDate(registration.crawlDate) : '-'}
                {registration.crawlTime ? ` · ${formatTimeRange(registration.crawlTime, registration.crawlEndTime)}` : ''}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  NYCPS Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="user@schools.nyc.gov"
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Status *</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as RegistrationStatus })}
                  required
                  className="w-full px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                >
                  {Object.values(RegistrationStatus).map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.emailSent}
                    onChange={(e) => setFormData({ ...formData, emailSent: e.target.checked })}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Email notification sent</span>
                </label>
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Check if a confirmation email has been sent for this crawl registration
                </p>
              </div>

              {(updateMutation.error || deleteMutation.error) && (
                <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-800 dark:text-red-200 text-sm">
                    {(updateMutation.error || deleteMutation.error) instanceof Error
                    ? (updateMutation.error || deleteMutation.error).message
                    : 'An error occurred'}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4">
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updateMutation.isPending ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-5 h-5" /> Save changes</>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteMutation.isPending}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isPending ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Deleting...</>
                  ) : (
                    <><Trash2 className="w-5 h-5" /> Delete</>
                  )}
                </button>
                <Link
                  href="/admin"
                  className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-semibold inline-flex items-center justify-center"
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
