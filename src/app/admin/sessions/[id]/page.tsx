'use client';

import { useState, use, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, X, Video, Calendar, Clock, Users } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import { MeetingType } from '@/types/session';

interface Session {
  _id: string;
  name: string;
  email: string;
  programName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: string;
  meetingType?: string;
  meetingLink?: string;
  teamsLink?: string;
  capacity: number;
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditSessionPage({ params }: PageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const resolvedParams = use(params);
  const sessionId = resolvedParams.id;
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

  const [formData, setFormData] = useState({
    meetingType: MeetingType.NONE,
    meetingLink: '',
  });

  // Fetch session data
  const { data: session, isLoading } = useQuery<Session>({
    queryKey: ['admin-session', sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/admin/sessions/${sessionId}`);
      if (!response.ok) throw new Error('Failed to fetch session');
      return response.json();
    },
    enabled: !!sessionId,
    onSuccess: (data) => {
      if (data) {
        setFormData({
          meetingType: (data.meetingType as MeetingType) || MeetingType.NONE,
          meetingLink: data.meetingLink || data.teamsLink || '',
        });
      }
    },
  });

  // Update session mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { meetingType: MeetingType; meetingLink: string }) => {
      const response = await fetch(`/api/admin/sessions/${sessionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['meetings'] });
      router.push('/admin');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const detectMeetingType = (url: string) => {
    if (!url) return MeetingType.NONE;
    const lowerUrl = url.toLowerCase();
    if (lowerUrl.includes('zoom.us') || lowerUrl.includes('zoom.com')) {
      return MeetingType.ZOOM;
    }
    if (lowerUrl.includes('teams.microsoft.com') || lowerUrl.includes('teams.office.com')) {
      return MeetingType.TEAMS;
    }
    return MeetingType.NONE;
  };

  const handleLinkChange = (link: string) => {
    setFormData({
      meetingLink: link,
      meetingType: detectMeetingType(link) || formData.meetingType,
    });
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
    return null; // Will redirect to login
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-blue-700 dark:text-blue-300">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 max-w-md w-full text-center space-y-4">
          <p className="text-red-800 dark:text-red-200">Session not found</p>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 mb-6 transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              Back to Admin
            </Link>
            <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 mb-2">
              Edit Session
            </h1>
            <p className="text-lg text-blue-600 dark:text-blue-400">
              Update meeting information for this session
            </p>
          </div>

          {/* Session Info Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-4">
              Session Details
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Program</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{session.programName}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Date</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{formatDate(session.sessionDate)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">{formatTime(session.sessionTime)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Type</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{session.sessionType}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-blue-200 dark:border-blue-800">
            <h2 className="text-2xl font-bold text-blue-800 dark:text-blue-200 mb-6">
              Meeting Information
            </h2>

            <div className="space-y-6">
              {/* Meeting Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Meeting Platform
                </label>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meetingType: MeetingType.NONE })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.meetingType === MeetingType.NONE
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-gray-100">None</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">No meeting link</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meetingType: MeetingType.ZOOM })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.meetingType === MeetingType.ZOOM
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Zoom</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Zoom meeting</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, meetingType: MeetingType.TEAMS })}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.meetingType === MeetingType.TEAMS
                        ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-gray-400'
                    }`}
                  >
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Teams</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Microsoft Teams</p>
                  </button>
                </div>
              </div>

              {/* Meeting Link */}
              {formData.meetingType !== MeetingType.NONE && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Meeting Link
                  </label>
                  <input
                    type="url"
                    value={formData.meetingLink}
                    onChange={(e) => handleLinkChange(e.target.value)}
                    placeholder={
                      formData.meetingType === MeetingType.ZOOM
                        ? 'https://zoom.us/j/...'
                        : 'https://teams.microsoft.com/...'
                    }
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                    required={formData.meetingType !== MeetingType.NONE}
                  />
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {formData.meetingType === MeetingType.ZOOM
                      ? 'Paste the Zoom meeting link here'
                      : 'Paste the Microsoft Teams meeting link here'}
                  </p>
                </div>
              )}

              {/* Auto-detection notice */}
              {formData.meetingLink && detectMeetingType(formData.meetingLink) !== MeetingType.NONE && 
               detectMeetingType(formData.meetingLink) !== formData.meetingType && (
                <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <p className="text-sm text-yellow-800 dark:text-yellow-200">
                    💡 Detected {detectMeetingType(formData.meetingLink) === MeetingType.ZOOM ? 'Zoom' : 'Teams'} link. 
                    Click the platform button above to confirm.
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-4 mt-8">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-5 h-5" />
                {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <Link
                href="/admin"
                className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Cancel
              </Link>
            </div>

            {updateMutation.isError && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  Error: {updateMutation.error instanceof Error ? updateMutation.error.message : 'Failed to update session'}
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
