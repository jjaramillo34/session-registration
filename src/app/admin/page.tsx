'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Users, 
  Video, 
  Edit, 
  Search, 
  Filter,
  Download,
  Settings,
  FileText,
  Mail,
  Phone,
  Globe,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import { formatDate, formatTime } from '@/lib/utils';
import { MeetingType } from '@/types/session';

interface Session {
  _id: string;
  programName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: string;
  meetingType?: string;
  meetingLink?: string;
  teamsLink?: string;
  capacity: number;
}

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
}

export default function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'sessions' | 'registrations'>('sessions');
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionFilter, setSessionFilter] = useState<'all' | 'daytime' | 'evening'>('all');
  const [registrationFilter, setRegistrationFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  // Fetch sessions
  const { data: sessions, isLoading: sessionsLoading, refetch: refetchSessions } = useQuery<Session[]>({
    queryKey: ['admin-sessions'],
    queryFn: async () => {
      const response = await fetch('/api/sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      return response.json();
    },
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  // Fetch registrations
  const { data: registrations, isLoading: registrationsLoading, refetch: refetchRegistrations } = useQuery<Registration[]>({
    queryKey: ['admin-registrations'],
    queryFn: async () => {
      const response = await fetch('/api/registrations');
      if (!response.ok) throw new Error('Failed to fetch registrations');
      return response.json();
    },
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  // Delete registration mutation - MUST be called before any early returns
  const deleteRegistrationMutation = useMutation({
    mutationFn: async (registrationId: string) => {
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
    },
  });

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
        } else {
          setIsAuthenticated(false);
          router.push('/admin/login');
        }
      } catch (error) {
        setIsAuthenticated(false);
        router.push('/admin/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Filter sessions
  const filteredSessions = sessions?.filter(session => {
    const matchesSearch = session.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.sessionDate.includes(searchTerm) ||
                         session.sessionTime.includes(searchTerm);
    const matchesFilter = sessionFilter === 'all' || session.sessionType === sessionFilter;
    return matchesSearch && matchesFilter;
  }) || [];

  // Filter registrations
  const filteredRegistrations = registrations?.filter(reg => {
    const matchesSearch = reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reg.programName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = registrationFilter === 'all' || reg.status.toLowerCase() === registrationFilter;
    return matchesSearch && matchesFilter;
  }) || [];

  // Get registration count per session
  const getRegistrationCount = (sessionId: string) => {
    return registrations?.filter(r => r.sessionId === sessionId && r.status === 'CONFIRMED').length || 0;
  };

  const handleDeleteRegistration = (registrationId: string, name: string) => {
    if (confirm(`Are you sure you want to delete the registration for ${name}? This action cannot be undone.`)) {
      deleteRegistrationMutation.mutate(registrationId);
    }
  };

  // Early returns AFTER all hooks are called
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

  const exportRegistrations = () => {
    if (!filteredRegistrations || filteredRegistrations.length === 0) return;
    
    const csv = [
      ['Name', 'Email', 'Language', 'Program', 'Agency', 'NYCPS Staff', 'Status', 'Session Date', 'Session Time', 'Registered Date'].join(','),
      ...filteredRegistrations.map(reg => {
        const session = sessions?.find(s => s._id === reg.sessionId);
        return [
          `"${reg.name}"`,
          `"${reg.email}"`,
          `"${reg.language}"`,
          `"${reg.programName}"`,
          `"${reg.agencyName || ''}"`,
          reg.isNYCPSStaff ? 'Yes' : 'No',
          `"${reg.status}"`,
          session ? `"${formatDate(session.sessionDate)}"` : '',
          session ? `"${formatTime(session.sessionTime)}"` : '',
          `"${new Date(reg.createdAt).toLocaleString()}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

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
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                Back to Home
              </Link>
              {user && (
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{user.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-blue-800 dark:text-blue-200 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-lg text-blue-600 dark:text-blue-400">
                  Manage sessions and registrations
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg mb-6 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab('sessions')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'sessions'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Video className="w-5 h-5" />
                  Sessions ({sessions?.length || 0})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('registrations')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'registrations'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-5 h-5" />
                  Registrations ({registrations?.length || 0})
                </div>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6 border-2 border-blue-200 dark:border-blue-800">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 focus:outline-none dark:bg-gray-700 dark:text-white"
                />
              </div>
              {activeTab === 'sessions' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setSessionFilter('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      sessionFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSessionFilter('daytime')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      sessionFilter === 'daytime'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Daytime
                  </button>
                  <button
                    onClick={() => setSessionFilter('evening')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      sessionFilter === 'evening'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Evening
                  </button>
                </div>
              )}
              {activeTab === 'registrations' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setRegistrationFilter('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      registrationFilter === 'all'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setRegistrationFilter('confirmed')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      registrationFilter === 'confirmed'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Confirmed
                  </button>
                  <button
                    onClick={() => setRegistrationFilter('cancelled')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      registrationFilter === 'cancelled'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Cancelled
                  </button>
                  <button
                    onClick={exportRegistrations}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-blue-200 dark:border-blue-800">
              {sessionsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading sessions...</p>
                </div>
              ) : filteredSessions.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No sessions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Program</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Date</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Time</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Type</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Meeting</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Registrations</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Capacity</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSessions.map((session) => {
                        const regCount = getRegistrationCount(session._id);
                        const meetingLink = session.meetingLink || session.teamsLink;
                        const meetingType = session.meetingType || (session.teamsLink ? 'teams' : 'none');
                        return (
                          <tr key={session._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/50">
                            <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{session.programName}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatDate(session.sessionDate)}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatTime(session.sessionTime)}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                session.sessionType === 'daytime'
                                  ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                                  : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'
                              }`}>
                                {session.sessionType}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {meetingLink ? (
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                  meetingType === 'zoom'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
                                }`}>
                                  {meetingType === 'zoom' ? 'Zoom' : 'Teams'}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">No link</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`font-semibold ${
                                regCount >= session.capacity ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                              }`}>
                                {regCount} / {session.capacity}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{session.capacity}</td>
                            <td className="py-3 px-4">
                              <Link
                                href={`/admin/sessions/${session._id}`}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Registrations Tab */}
          {activeTab === 'registrations' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-blue-200 dark:border-blue-800">
              {registrationsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading registrations...</p>
                </div>
              ) : filteredRegistrations.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No registrations found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Name</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Email</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Program</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Language</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Agency</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">NYCPS Staff</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Status</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Email Sent</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Registered</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRegistrations.map((reg) => {
                        const session = sessions?.find(s => s._id === reg.sessionId);
                        return (
                          <tr key={reg._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/50">
                            <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{reg.name}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{reg.email}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{reg.programName}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{reg.language}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{reg.agencyName || '-'}</td>
                            <td className="py-3 px-4">
                              {reg.isNYCPSStaff ? (
                                <span className="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 rounded-full text-xs font-semibold">
                                  Yes
                                </span>
                              ) : (
                                <span className="text-gray-400 text-sm">No</span>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                reg.status === 'CONFIRMED'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                              }`}>
                                {reg.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              {reg.emailSent ? (
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full text-xs font-semibold">
                                  ✓ Sent
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 rounded-full text-xs font-semibold">
                                  Pending
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                              {new Date(reg.createdAt).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/registrations/${reg._id}`}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDeleteRegistration(reg._id, reg.name)}
                                  disabled={deleteRegistrationMutation.isPending}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
