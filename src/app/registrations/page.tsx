'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Search, Download, Filter } from 'lucide-react';
import Link from 'next/link';
import { formatDate, formatTime } from '@/lib/utils';

interface Registration {
  id: number;
  name: string;
  email: string;
  language: string;
  programName: string;
  isNYCPSStaff: boolean;
  status: 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  session: {
    sessionDate: string;
    sessionTime: string;
    sessionType: string;
  };
}

type SortField = 'name' | 'email' | 'programName' | 'sessionDate' | 'language' | 'status';
type SortOrder = 'asc' | 'desc';

export default function RegistrationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('sessionDate');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [programFilter, setProgramFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [languageFilter, setLanguageFilter] = useState<string>('');

  const { data: registrations, isLoading, error } = useQuery<Registration[]>({
    queryKey: ['registrations'],
    queryFn: async () => {
      const response = await fetch('/api/registrations');
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      return response.json();
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedRegistrations = registrations
    ?.filter(registration => {
      const matchesSearch = searchTerm === '' || 
        registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        registration.programName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesProgram = programFilter === '' || registration.programName === programFilter;
      const matchesStatus = statusFilter === '' || registration.status === statusFilter;
      const matchesLanguage = languageFilter === '' || registration.language === languageFilter;

      return matchesSearch && matchesProgram && matchesStatus && matchesLanguage;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'email':
          comparison = a.email.localeCompare(b.email);
          break;
        case 'programName':
          comparison = a.programName.localeCompare(b.programName);
          break;
        case 'sessionDate':
          comparison = a.session.sessionDate.localeCompare(b.session.sessionDate);
          break;
        case 'language':
          comparison = a.language.localeCompare(b.language);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleExport = () => {
    if (!filteredAndSortedRegistrations) return;

    const csvContent = [
      ['Name', 'Email', 'Program', 'Date', 'Time', 'Language', 'Status', 'NYCPS Staff', 'Created At'],
      ...filteredAndSortedRegistrations.map(reg => [
        reg.name,
        reg.email,
        reg.programName,
        reg.session.sessionDate,
        reg.session.sessionTime,
        reg.language,
        reg.status,
        reg.isNYCPSStaff ? 'Yes' : 'No',
        new Date(reg.createdAt).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
        <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg">
          <p className="text-red-800 dark:text-red-200">Error loading registrations</p>
        </div>
      </div>
    );
  }

  const uniquePrograms = [...new Set(registrations?.map(reg => reg.programName))];
  const uniqueLanguages = [...new Set(registrations?.map(reg => reg.language))];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <button
              onClick={handleExport}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 mb-8">
            Registrations
          </h1>

          {/* Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                />
              </div>
              <select
                value={programFilter}
                onChange={(e) => setProgramFilter(e.target.value)}
                className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">All Programs</option>
                {uniquePrograms.map(program => (
                  <option key={program} value={program}>{program}</option>
                ))}
              </select>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value)}
                className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">All Languages</option>
                {uniqueLanguages.map(language => (
                  <option key={language} value={language}>{language}</option>
                ))}
              </select>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
              >
                <option value="">All Statuses</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    {[
                      { key: 'name', label: 'Name' },
                      { key: 'email', label: 'Email' },
                      { key: 'programName', label: 'Program' },
                      { key: 'sessionDate', label: 'Date' },
                      { key: 'language', label: 'Language' },
                      { key: 'status', label: 'Status' }
                    ].map(({ key, label }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key as SortField)}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <div className="flex items-center gap-2">
                          {label}
                          {sortField === key && (
                            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredAndSortedRegistrations?.map((registration) => (
                    <tr key={registration.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {registration.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {registration.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {registration.programName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatDate(registration.session.sessionDate)} {formatTime(registration.session.sessionTime)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {registration.language}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          registration.status === 'CONFIRMED'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200'
                        }`}>
                          {registration.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 