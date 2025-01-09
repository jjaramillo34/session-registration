'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Search, SortAsc, SortDesc, Mail, RefreshCw } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';

interface Session {
  id: number;
  name: string;
  email: string;
  programName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: 'daytime' | 'evening';
}

type SortField = 'name' | 'email' | 'programName' | 'sessionDate' | 'sessionTime' | 'sessionType';
type SortOrder = 'asc' | 'desc';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'daytime' | 'evening'>('all');
  const [filterDate, setFilterDate] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('sessionDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sessions', {
        cache: 'no-store',
        next: { revalidate: 0 }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch sessions');
      }
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = 
        session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.programName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || session.sessionType === filterType;
      const matchesDate = filterDate === 'all' || session.sessionDate === filterDate;
      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const order = sortOrder === 'asc' ? 1 : -1;
      return aValue < bValue ? -1 * order : aValue > bValue ? 1 * order : 0;
    });

  const uniqueDates = [...new Set(sessions.map(s => s.sessionDate))].sort();

  const tableColumns = [
    { field: 'name', label: 'Name' },
    { field: 'email', label: 'Email' },
    { field: 'programName', label: 'Program' },
    { field: 'sessionDate', label: 'Date' },
    { field: 'sessionTime', label: 'Time' },
    { field: 'sessionType', label: 'Session Type' }
  ];

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'Program', 'Date', 'Time', 'Session Type'];
    const csvData = filteredSessions.map(session => [
      session.name,
      session.email,
      session.programName,
      formatDate(session.sessionDate),
      formatTime(session.sessionTime),
      session.sessionType
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `sessions-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Registration</span>
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          Registered Sessions
        </h1>
        <button
          onClick={fetchSessions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Total Sessions</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{sessions.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Daytime Sessions</h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {sessions.filter(s => s.sessionType === 'daytime').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Evening Sessions</h3>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
            {sessions.filter(s => s.sessionType === 'evening').length}
          </p>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by name or program..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'all' | 'daytime' | 'evening')}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="all">All Types</option>
          <option value="daytime">Daytime</option>
          <option value="evening">Evening</option>
        </select>

        <select
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="all">All Dates</option>
          {uniqueDates.map(date => (
            <option key={date} value={date}>{formatDate(date)}</option>
          ))}
        </select>

        <button
          onClick={exportToCSV}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {tableColumns.map(({ field, label }) => (
                  <th
                    key={field}
                    onClick={() => handleSort(field as SortField)}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <div className="flex items-center gap-2">
                      {field === 'email' && <Mail className="w-4 h-4" />}
                      {label}
                      {sortField === field && (
                        sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredSessions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No sessions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {session.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      <a 
                        href={`mailto:${session.email}`}
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Mail className="w-4 h-4" />
                        {session.email}
                      </a>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {session.programName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatDate(session.sessionDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                      {formatTime(session.sessionTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        session.sessionType === 'daytime' 
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' 
                          : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                      }`}>
                        {session.sessionType === 'daytime' ? 'Daytime' : 'Evening'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 