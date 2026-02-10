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
  Trash2,
  ArrowUp,
  ArrowDown,
  ChevronUp,
  ChevronDown,
  MapPin
} from 'lucide-react';
import Image from 'next/image';
import { formatDate, formatTime, formatTimeRange } from '@/lib/utils';
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

interface CrawlRegistrationRow {
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
}

interface CrawlEvent {
  id: string;
  name: string;
  location: string;
  address: string;
  date: string;
  time: string;
  endTime?: string;
  borough?: string;
  capacity: number;
  description: string;
  _count?: { registrations: number };
}

export default function AdminPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'sessions' | 'registrations' | 'crawls' | 'crawl-registrations'>('sessions');
  const [searchTerm, setSearchTerm] = useState('');
  const [sessionFilter, setSessionFilter] = useState<'all' | 'daytime' | 'evening'>('all');
  const [registrationFilter, setRegistrationFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [emailSentFilter, setEmailSentFilter] = useState<'all' | 'sent' | 'pending'>('all');
  const [crawlRegFilter, setCrawlRegFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [crawlRegEmailFilter, setCrawlRegEmailFilter] = useState<'all' | 'sent' | 'pending'>('all');
  
  // Sorting state
  const [sessionSortField, setSessionSortField] = useState<string | null>(null);
  const [sessionSortDirection, setSessionSortDirection] = useState<'asc' | 'desc'>('asc');
  const [registrationSortField, setRegistrationSortField] = useState<string | null>(null);
  const [registrationSortDirection, setRegistrationSortDirection] = useState<'asc' | 'desc'>('asc');
  const [crawlRegSortField, setCrawlRegSortField] = useState<string | null>(null);
  const [crawlRegSortDirection, setCrawlRegSortDirection] = useState<'asc' | 'desc'>('asc');
  const [crawlSortField, setCrawlSortField] = useState<string | null>(null);
  const [crawlSortDirection, setCrawlSortDirection] = useState<'asc' | 'desc'>('asc');
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

  // Fetch crawl events (site crawls list)
  const { data: crawls, isLoading: crawlsLoading } = useQuery<CrawlEvent[]>({
    queryKey: ['admin-crawls'],
    queryFn: async () => {
      const response = await fetch('/api/crawls');
      if (!response.ok) throw new Error('Failed to fetch crawls');
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // Fetch crawl registrations
  const { data: crawlRegistrations, isLoading: crawlRegistrationsLoading } = useQuery<CrawlRegistrationRow[]>({
    queryKey: ['admin-crawl-registrations'],
    queryFn: async () => {
      const response = await fetch('/api/admin/crawl-registrations');
      if (!response.ok) throw new Error('Failed to fetch crawl registrations');
      return response.json();
    },
    enabled: isAuthenticated,
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

  const deleteCrawlRegistrationMutation = useMutation({
    mutationFn: async (registrationId: string) => {
      const response = await fetch(`/api/admin/crawl-registrations/${registrationId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete crawl registration');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-crawl-registrations'] });
    },
  });

  const deleteCrawlMutation = useMutation({
    mutationFn: async (crawlId: string) => {
      const response = await fetch(`/api/admin/crawls/${crawlId}`, { method: 'DELETE' });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete crawl');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-crawls'] });
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

  // Sort and filter sessions
  const filteredAndSortedSessions = (() => {
    let filtered = sessions?.filter(session => {
      const matchesSearch = session.programName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           session.sessionDate.includes(searchTerm) ||
                           session.sessionTime.includes(searchTerm);
      const matchesFilter = sessionFilter === 'all' || session.sessionType === sessionFilter;
      return matchesSearch && matchesFilter;
    }) || [];

    // Apply sorting
    if (sessionSortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = a[sessionSortField as keyof typeof a];
        let bValue: any = b[sessionSortField as keyof typeof b];

        // Handle date sorting
        if (sessionSortField === 'sessionDate') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }
        // Handle time sorting
        else if (sessionSortField === 'sessionTime') {
          aValue = aValue.split(':').map(Number);
          bValue = bValue.split(':').map(Number);
          aValue = aValue[0] * 60 + aValue[1];
          bValue = bValue[0] * 60 + bValue[1];
        }
        // Handle string sorting
        else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sessionSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sessionSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  })();

  const handleSessionSort = (field: string) => {
    if (sessionSortField === field) {
      setSessionSortDirection(sessionSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSessionSortField(field);
      setSessionSortDirection('asc');
    }
  };

  // Sort and filter registrations
  const filteredAndSortedRegistrations = (() => {
    let filtered = registrations?.filter(reg => {
      const matchesSearch = reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           reg.programName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatusFilter = registrationFilter === 'all' || reg.status.toLowerCase() === registrationFilter;
      const matchesEmailSentFilter = emailSentFilter === 'all' || 
                                    (emailSentFilter === 'sent' && reg.emailSent === true) ||
                                    (emailSentFilter === 'pending' && (reg.emailSent === false || reg.emailSent === undefined));
      return matchesSearch && matchesStatusFilter && matchesEmailSentFilter;
    }) || [];

    // Apply sorting
    if (registrationSortField) {
      filtered = [...filtered].sort((a, b) => {
        let aValue: any = a[registrationSortField as keyof typeof a];
        let bValue: any = b[registrationSortField as keyof typeof b];

        // Handle date sorting
        if (registrationSortField === 'createdAt') {
          aValue = new Date(aValue).getTime();
          bValue = new Date(bValue).getTime();
        }
        // Handle boolean sorting
        else if (typeof aValue === 'boolean') {
          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
        }
        // Handle string sorting
        else if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return registrationSortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return registrationSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  })();

  const handleRegistrationSort = (field: string) => {
    if (registrationSortField === field) {
      setRegistrationSortDirection(registrationSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setRegistrationSortField(field);
      setRegistrationSortDirection('asc');
    }
  };

  // Filter and sort crawl registrations
  const filteredAndSortedCrawlRegistrations = (() => {
    let filtered = crawlRegistrations?.filter((reg) => {
      const matchesSearch =
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.crawlName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.crawlLocation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        crawlRegFilter === 'all' || reg.status.toLowerCase() === crawlRegFilter;
      const matchesEmail =
        crawlRegEmailFilter === 'all' ||
        (crawlRegEmailFilter === 'sent' && reg.emailSent === true) ||
        (crawlRegEmailFilter === 'pending' && (reg.emailSent === false || reg.emailSent === undefined));
      return matchesSearch && matchesStatus && matchesEmail;
    }) ?? [];

    if (crawlRegSortField) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: any = a[crawlRegSortField as keyof CrawlRegistrationRow];
        let bVal: any = b[crawlRegSortField as keyof CrawlRegistrationRow];
        if (crawlRegSortField === 'createdAt' || crawlRegSortField === 'crawlDate') {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        } else if (crawlRegSortField === 'emailSent' || typeof aVal === 'boolean') {
          aVal = aVal ? 1 : 0;
          bVal = bVal ? 1 : 0;
        } else if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal?.toLowerCase?.() ?? '';
        }
        if (aVal < bVal) return crawlRegSortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return crawlRegSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  })();

  const handleCrawlRegSort = (field: string) => {
    if (crawlRegSortField === field) {
      setCrawlRegSortDirection(crawlRegSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setCrawlRegSortField(field);
      setCrawlRegSortDirection('asc');
    }
  };

  // Filter and sort crawls (events)
  const filteredAndSortedCrawls = (() => {
    if (!crawls) return [];
    let filtered = crawls;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = crawls.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.location?.toLowerCase().includes(term) ||
          c.address?.toLowerCase().includes(term) ||
          c.borough?.toLowerCase().includes(term) ||
          c.description?.toLowerCase().includes(term)
      );
    }
    if (crawlSortField) {
      filtered = [...filtered].sort((a, b) => {
        let aVal: string | number;
        let bVal: string | number;
        if (crawlSortField === 'date') {
          aVal = new Date(a.date).getTime();
          bVal = new Date(b.date).getTime();
        } else if (crawlSortField === 'regCount') {
          aVal = a._count?.registrations ?? 0;
          bVal = b._count?.registrations ?? 0;
        } else if (crawlSortField === 'spotsLeft') {
          aVal = Math.max(0, a.capacity - (a._count?.registrations ?? 0));
          bVal = Math.max(0, b.capacity - (b._count?.registrations ?? 0));
        } else {
          const aRaw = a[crawlSortField as keyof CrawlEvent];
          const bRaw = b[crawlSortField as keyof CrawlEvent];
          aVal = typeof aRaw === 'string' ? aRaw.toLowerCase() : '';
          bVal = typeof bRaw === 'string' ? (bRaw as string).toLowerCase() : '';
        }
        if (aVal < bVal) return crawlSortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return crawlSortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return filtered;
  })();

  const handleCrawlSort = (field: string) => {
    if (crawlSortField === field) {
      setCrawlSortDirection(crawlSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setCrawlSortField(field);
      setCrawlSortDirection('asc');
    }
  };

  // Get registration count per session
  const getRegistrationCount = (sessionId: string) => {
    return registrations?.filter(r => r.sessionId === sessionId && r.status === 'CONFIRMED').length || 0;
  };

  const handleDeleteRegistration = (registrationId: string, name: string) => {
    if (confirm(`Are you sure you want to delete the registration for ${name}? This action cannot be undone.`)) {
      deleteRegistrationMutation.mutate(registrationId);
    }
  };

  const handleDeleteCrawlRegistration = (registrationId: string, name: string) => {
    if (confirm(`Are you sure you want to delete the crawl registration for ${name}? This cannot be undone.`)) {
      deleteCrawlRegistrationMutation.mutate(registrationId);
    }
  };

  const handleDeleteCrawl = (crawlId: string, name: string) => {
    if (confirm(`Are you sure you want to delete the crawl event "${name}"? This cannot be undone. Any registrations for this crawl will need to be removed first.`)) {
      deleteCrawlMutation.mutate(crawlId);
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
    if (!filteredAndSortedRegistrations || filteredAndSortedRegistrations.length === 0) return;
    
    const csv = [
      ['Name', 'Email', 'Language', 'Program', 'Agency', 'NYCPS Staff', 'Status', 'Email Sent', 'Session Date', 'Session Time', 'Registered Date'].join(','),
      ...filteredAndSortedRegistrations.map(reg => {
        const session = sessions?.find(s => s._id === reg.sessionId);
        return [
          `"${reg.name}"`,
          `"${reg.email}"`,
          `"${reg.language}"`,
          `"${reg.programName}"`,
          `"${reg.agencyName || ''}"`,
          reg.isNYCPSStaff ? 'Yes' : 'No',
          `"${reg.status}"`,
          reg.emailSent ? 'Yes' : 'No',
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

  const exportCrawlRegistrations = () => {
    if (!filteredAndSortedCrawlRegistrations?.length) return;
    const csv = [
      ['Name', 'Email', 'Crawl', 'Location', 'Address', 'Date', 'Time', 'Status', 'Email Sent', 'Registered'].join(','),
      ...filteredAndSortedCrawlRegistrations.map((reg) =>
        [
          `"${reg.name}"`,
          `"${reg.email}"`,
          `"${(reg.crawlName || '').replace(/"/g, '""')}"`,
          `"${(reg.crawlLocation || '').replace(/"/g, '""')}"`,
          `"${(reg.crawlAddress || '').replace(/"/g, '""')}"`,
          `"${formatDate(reg.crawlDate)}"`,
          `"${formatTimeRange(reg.crawlTime, reg.crawlEndTime)}"`,
          `"${reg.status}"`,
          reg.emailSent ? 'Yes' : 'No',
          `"${new Date(reg.createdAt).toLocaleString()}"`,
        ].join(',')
      ),
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crawl-registrations-${new Date().toISOString().split('T')[0]}.csv`;
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
                <div className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
                  Back to Home
                </div>
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
              <button
                onClick={() => setActiveTab('crawls')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'crawls'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Crawls ({crawls?.length || 0})
                </div>
              </button>
              <button
                onClick={() => setActiveTab('crawl-registrations')}
                className={`flex-1 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'crawl-registrations'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Crawl Regs ({crawlRegistrations?.length || 0})
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
                  placeholder={`Search ${
                activeTab === 'crawls'
                  ? 'crawls'
                  : activeTab === 'crawl-registrations'
                    ? 'crawl registrations'
                    : activeTab
              }...`}
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
              {activeTab === 'crawl-registrations' && (
                <div className="flex flex-wrap gap-2 items-center">
                  <div className="flex gap-2 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
                    <span className="px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Status:</span>
                    <button
                      onClick={() => setCrawlRegFilter('all')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        crawlRegFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setCrawlRegFilter('confirmed')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        crawlRegFilter === 'confirmed' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Confirmed
                    </button>
                    <button
                      onClick={() => setCrawlRegFilter('cancelled')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        crawlRegFilter === 'cancelled' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Cancelled
                    </button>
                  </div>
                  <div className="flex gap-2 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
                    <span className="px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Email:</span>
                    <button
                      onClick={() => setCrawlRegEmailFilter('all')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        crawlRegEmailFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setCrawlRegEmailFilter('sent')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        crawlRegEmailFilter === 'sent' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Sent
                    </button>
                    <button
                      onClick={() => setCrawlRegEmailFilter('pending')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        crawlRegEmailFilter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Pending
                    </button>
                  </div>
                  <button
                    onClick={exportCrawlRegistrations}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Export CSV
                  </button>
                </div>
              )}
              {activeTab === 'registrations' && (
                <div className="flex flex-wrap gap-2">
                  <div className="flex gap-2 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
                    <span className="px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Status:</span>
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
                  </div>
                  <div className="flex gap-2 border-r border-gray-300 dark:border-gray-600 pr-2 mr-2">
                    <span className="px-2 py-2 text-sm font-semibold text-gray-600 dark:text-gray-400">Email:</span>
                    <button
                      onClick={() => setEmailSentFilter('all')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        emailSentFilter === 'all'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setEmailSentFilter('sent')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        emailSentFilter === 'sent'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Sent
                    </button>
                    <button
                      onClick={() => setEmailSentFilter('pending')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        emailSentFilter === 'pending'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Pending
                    </button>
                  </div>
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
              ) : filteredAndSortedSessions.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No sessions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleSessionSort('programName')}
                        >
                          <div className="flex items-center gap-2">
                            Program
                            {sessionSortField === 'programName' && (
                              sessionSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleSessionSort('sessionDate')}
                        >
                          <div className="flex items-center gap-2">
                            Date
                            {sessionSortField === 'sessionDate' && (
                              sessionSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleSessionSort('sessionTime')}
                        >
                          <div className="flex items-center gap-2">
                            Time
                            {sessionSortField === 'sessionTime' && (
                              sessionSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleSessionSort('sessionType')}
                        >
                          <div className="flex items-center gap-2">
                            Type
                            {sessionSortField === 'sessionType' && (
                              sessionSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Meeting</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Registrations</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Capacity</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedSessions.map((session) => {
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
              ) : filteredAndSortedRegistrations.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No registrations found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleRegistrationSort('name')}
                        >
                          <div className="flex items-center gap-2">
                            Name
                            {registrationSortField === 'name' && (
                              registrationSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleRegistrationSort('email')}
                        >
                          <div className="flex items-center gap-2">
                            Email
                            {registrationSortField === 'email' && (
                              registrationSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleRegistrationSort('programName')}
                        >
                          <div className="flex items-center gap-2">
                            Program
                            {registrationSortField === 'programName' && (
                              registrationSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleRegistrationSort('language')}
                        >
                          <div className="flex items-center gap-2">
                            Language
                            {registrationSortField === 'language' && (
                              registrationSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Agency</th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleRegistrationSort('isNYCPSStaff')}
                        >
                          <div className="flex items-center gap-2">
                            NYCPS Staff
                            {registrationSortField === 'isNYCPSStaff' && (
                              registrationSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleRegistrationSort('status')}
                        >
                          <div className="flex items-center gap-2">
                            Status
                            {registrationSortField === 'status' && (
                              registrationSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleRegistrationSort('emailSent')}
                        >
                          <div className="flex items-center gap-2">
                            Email Sent
                            {registrationSortField === 'emailSent' && (
                              registrationSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th 
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleRegistrationSort('createdAt')}
                        >
                          <div className="flex items-center gap-2">
                            Registered
                            {registrationSortField === 'createdAt' && (
                              registrationSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedRegistrations.map((reg) => {
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

          {/* Crawls Tab (site crawl events) */}
          {activeTab === 'crawls' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-blue-200 dark:border-blue-800">
              {crawlsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto" />
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading crawls...</p>
                </div>
              ) : filteredAndSortedCrawls.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">
                    {crawls?.length ? 'No crawls match your search' : 'No crawl events found'}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlSort('name')}
                        >
                          <div className="flex items-center gap-2">
                            Event
                            {crawlSortField === 'name' && (crawlSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlSort('borough')}
                        >
                          <div className="flex items-center gap-2">
                            Borough
                            {crawlSortField === 'borough' && (crawlSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Address</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Description</th>
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlSort('date')}
                        >
                          <div className="flex items-center gap-2">
                            Date
                            {crawlSortField === 'date' && (crawlSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Time</th>
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlSort('regCount')}
                        >
                          <div className="flex items-center gap-2">
                            Registrations
                            {crawlSortField === 'regCount' && (crawlSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlSort('spotsLeft')}
                        >
                          <div className="flex items-center gap-2">
                            Spots left
                            {crawlSortField === 'spotsLeft' && (crawlSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />)}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedCrawls.map((crawl) => {
                        const regCount = crawl._count?.registrations ?? 0;
                        const spotsLeft = Math.max(0, crawl.capacity - regCount);
                        return (
                          <tr
                            key={crawl.id}
                            className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/50"
                          >
                            <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{crawl.name}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{crawl.borough || '-'}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm max-w-xs truncate" title={crawl.address}>
                              {crawl.address || '-'}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm max-w-[200px] truncate" title={crawl.description || ''}>
                              {crawl.description || '-'}
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{formatDate(crawl.date)}</td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                              {formatTimeRange(crawl.time, crawl.endTime)}
                            </td>
                            <td className="py-3 px-4">
                              <span
                                className={
                                  regCount >= crawl.capacity
                                    ? 'font-semibold text-red-600 dark:text-red-400'
                                    : 'font-semibold text-green-600 dark:text-green-400'
                                }
                              >
                                {regCount} / {crawl.capacity}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{spotsLeft}</td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/admin/crawls/${crawl.id}`}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                                >
                                  <Edit className="w-4 h-4" />
                                  Edit
                                </Link>
                                <button
                                  onClick={() => handleDeleteCrawl(crawl.id, crawl.name)}
                                  disabled={deleteCrawlMutation.isPending || regCount > 0}
                                  className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                  title={regCount > 0 ? 'Remove all registrations first' : 'Delete crawl event'}
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

          {/* Crawl Registrations Tab */}
          {activeTab === 'crawl-registrations' && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-2 border-blue-200 dark:border-blue-800">
              {crawlRegistrationsLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600 dark:text-gray-400">Loading crawl registrations...</p>
                </div>
              ) : filteredAndSortedCrawlRegistrations.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">No crawl registrations found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200 dark:border-gray-700">
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlRegSort('name')}
                        >
                          <div className="flex items-center gap-2">
                            Name
                            {crawlRegSortField === 'name' && (
                              crawlRegSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlRegSort('email')}
                        >
                          <div className="flex items-center gap-2">
                            Email
                            {crawlRegSortField === 'email' && (
                              crawlRegSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlRegSort('crawlName')}
                        >
                          <div className="flex items-center gap-2">
                            Crawl / Event
                            {crawlRegSortField === 'crawlName' && (
                              crawlRegSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Address</th>
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlRegSort('crawlDate')}
                        >
                          <div className="flex items-center gap-2">
                            Date & Time
                            {crawlRegSortField === 'crawlDate' && (
                              crawlRegSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlRegSort('status')}
                        >
                          <div className="flex items-center gap-2">
                            Status
                            {crawlRegSortField === 'status' && (
                              crawlRegSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlRegSort('emailSent')}
                        >
                          <div className="flex items-center gap-2">
                            Email Sent
                            {crawlRegSortField === 'emailSent' && (
                              crawlRegSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th
                          className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          onClick={() => handleCrawlRegSort('createdAt')}
                        >
                          <div className="flex items-center gap-2">
                            Registered
                            {crawlRegSortField === 'createdAt' && (
                              crawlRegSortDirection === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedCrawlRegistrations.map((reg) => (
                        <tr key={reg._id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{reg.name}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{reg.email}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{reg.crawlName || '-'}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm max-w-xs truncate" title={reg.crawlAddress}>{reg.crawlAddress || '-'}</td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400 text-sm">
                            {reg.crawlDate
                              ? `${formatDate(reg.crawlDate)}${reg.crawlTime ? ` · ${formatTimeRange(reg.crawlTime, reg.crawlEndTime)}` : ''}`
                              : '-'}
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
                                href={`/admin/crawl-registrations/${reg._id}`}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                              >
                                <Edit className="w-4 h-4" />
                                Edit
                              </Link>
                              <button
                                onClick={() => handleDeleteCrawlRegistration(reg._id, reg.name)}
                                disabled={deleteCrawlRegistrationMutation.isPending}
                                className="inline-flex items-center gap-1 px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
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
