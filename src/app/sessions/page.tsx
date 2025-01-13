'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Search, SortAsc, SortDesc, Mail, RefreshCw, Info } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import SessionDetails from '@/components/SessionDetails';

interface Session {
  id: number;
  name: string;
  email: string;
  programName: string;
  sessionDate: string;
  sessionTime: string;
  sessionType: 'daytime' | 'evening';
  teamsLink?: string;
}

type SortField = 'name' | 'email' | 'programName' | 'sessionDate' | 'sessionTime' | 'sessionType';
type SortOrder = 'asc' | 'desc';

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'daytime' | 'evening'>('all');
  const [filterDate, setFilterDate] = useState('all');
  const [sortField, setSortField] = useState<SortField>('sessionDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const uniqueDates = [...new Set(sessions.map(s => s.sessionDate))].sort();

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleUpdateSession = async (id: number, teamsLink: string) => {
    try {
      const response = await fetch(`/api/sessions/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamsLink }),
      });

      if (!response.ok) {
        throw new Error('Failed to update session');
      }

      const updatedSession = await response.json();
      setSessions(sessions.map(s => s.id === id ? { ...s, teamsLink } : s));
      setSelectedSession(null);
    } catch (error) {
      console.error('Failed to update session:', error);
      throw error;
    }
  };

  const filteredSessions = sessions
    .filter(session => {
      const matchesSearch = session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.programName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || session.sessionType === filterType;
      const matchesDate = filterDate === 'all' || session.sessionDate === filterDate;
      return matchesSearch && matchesType && matchesDate;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const order = sortOrder === 'asc' ? 1 : -1;
      return aValue < bValue ? -order : aValue > bValue ? order : 0;
    });

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
          onClick={() => {
            const csvContent = [
              ['Name', 'Email', 'Program', 'Date', 'Time', 'Type', 'Teams Link'],
              ...filteredSessions.map(s => [
                s.name,
                s.email,
                s.programName,
                formatDate(s.sessionDate),
                formatTime(s.sessionTime),
                s.sessionType,
                s.teamsLink || ''
              ])
            ].map(row => row.join(',')).join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sessions-${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="w-5 h-5" />
          Export CSV
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    Name
                    {sortField === 'name' && (
                      sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('programName')}
                >
                  <div className="flex items-center gap-1">
                    Program
                    {sortField === 'programName' && (
                      sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('sessionDate')}
                >
                  <div className="flex items-center gap-1">
                    Date
                    {sortField === 'sessionDate' && (
                      sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('sessionTime')}
                >
                  <div className="flex items-center gap-1">
                    Time
                    {sortField === 'sessionTime' && (
                      sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('sessionType')}
                >
                  <div className="flex items-center gap-1">
                    Type
                    {sortField === 'sessionType' && (
                      sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                    )}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSessions.map((session) => (
                <tr key={session.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{session.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{session.programName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatDate(session.sessionDate)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white">{formatTime(session.sessionTime)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      session.sessionType === 'daytime'
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
                    }`}>
                      {session.sessionType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedSession(session)}
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                        title="View Details"
                      >
                        <Info className="w-5 h-5" />
                      </button>
                      <a
                        href={`mailto:${session.email}`}
                        className="text-gray-600 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        title="Send Email"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedSession && (
        <SessionDetails
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
          onUpdate={handleUpdateSession}
        />
      )}
    </div>
  );
} 