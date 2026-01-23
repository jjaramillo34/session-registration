'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';

interface TimeSlot {
  id: string;
  date: string;
  time: string;
  sessionType: 'daytime' | 'evening';
}

interface SessionRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  programName: string;
  timeSlot: TimeSlot;
}

interface RegistrationFormData {
  name: string;
  email: string;
  language?: string;
  agencyName?: string;
}

const LANGUAGES = [
  { value: 'ASL', label: 'American Sign Language' },
  { value: 'ARABIC', label: 'العربية (Arabic)' },
  { value: 'BANGLA', label: 'বাংলা (Bangla)' },
  { value: 'CHINESE_MANDARIN', label: '普通话 (Chinese Mandarin)' },
  { value: 'CHINESE_CANTONESE', label: '廣東話 (Chinese Cantonese)' },
  { value: 'ENGLISH', label: 'English' },
  { value: 'FRENCH', label: 'Français (French)' },
  { value: 'HAITIAN_CREOLE', label: 'Kreyòl Ayisyen (Haitian Creole)' },
  { value: 'KOREAN', label: '한국어 (Korean)' },
  { value: 'RUSSIAN', label: 'Русский (Russian)' },
  { value: 'SPANISH', label: 'Español (Spanish)' },
  { value: 'URDU', label: 'اردو (Urdu)' }
];

export default function SessionRegistrationModal({
  isOpen,
  onClose,
  programName,
  timeSlot
}: SessionRegistrationModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<RegistrationFormData>();

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          programName,
          timeSlotId: timeSlot.id,
          isNYCPSStaff: data.email.toLowerCase().endsWith('@schools.nyc.gov'),
          // Set default language to English for daytime sessions
          language: timeSlot.sessionType === 'daytime' ? 'ENGLISH' : data.language,
          // Set default agency name to "Public" if not provided
          agencyName: data.agencyName || 'Public'
        }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to register');
      }

      setSuccess(true);
      reset();
      setTimeout(() => {
        onClose();
        setSuccess(false);
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to register');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const isDaytimeSession = timeSlot.sessionType === 'daytime';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6 shadow-2xl transform transition-all relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 pr-8">
          Register for {programName}
        </h2>

        <div className="mb-6 space-y-2">
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Date: <span className="font-normal">{formatDate(timeSlot.date)}</span>
          </p>
          <p className="text-gray-700 dark:text-gray-300 font-medium">
            Time: <span className="font-normal">{formatTime(timeSlot.time)}</span>
          </p>
          <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <a 
              href="#" 
              className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              {isDaytimeSession ? 'Morning Session - Open to All' : 'Evening Session - Open to All'}
            </a>
          </div>
        </div>

        {success ? (
          <div className="bg-green-50 dark:bg-green-900/30 p-4 rounded-lg">
            <p className="text-green-800 dark:text-green-200">
              Registration successful! You will receive a confirmation email shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
                <p className="text-red-800 dark:text-red-200">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Name is required' })}
                className="mt-1 block w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="mt-1 block w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your email address"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Organization/Agency Name - Optional, defaults to "Public" */}
            <div>
              <label htmlFor="agencyName" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Organization/Agency Name <span className="text-gray-500 font-normal text-xs">(Optional)</span>
              </label>
              <input
                type="text"
                id="agencyName"
                {...register('agencyName')}
                className="mt-1 block w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                placeholder="Enter your organization or agency name (leave blank for 'Public')"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                If left blank, will default to "Public"
              </p>
            </div>

            {/* Language Selection - Only for evening sessions */}
            {!isDaytimeSession && (
              <div>
                <label htmlFor="language" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                  Preferred Language <span className="text-red-500">*</span>
                </label>
                <select
                  id="language"
                  {...register('language', {
                    required: 'Language selection is required for evening sessions'
                  })}
                  className="mt-1 block w-full px-3 py-2 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors"
                >
                  {LANGUAGES.map(lang => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
                {errors.language && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.language.message}</p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md hover:shadow-lg"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 