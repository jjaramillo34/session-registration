'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';

interface TimeSlot {
  id: number;
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
          language: timeSlot.sessionType === 'daytime' ? 'ENGLISH' : data.language
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Register for {programName}
        </h2>

        <div className="mb-4">
          <p className="text-gray-600 dark:text-gray-300">
            Date: {formatDate(timeSlot.date)}
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            Time: {formatTime(timeSlot.time)}
          </p>
          <p className="mt-2 text-sm text-blue-600 dark:text-blue-400">
            {isDaytimeSession ? 'Morning Session - For NYCPS Staff and Partner Agencies' : 'Evening Session - Open to All'}
          </p>
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Name is required' })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
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
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Agency Name - Only for daytime sessions */}
            {isDaytimeSession && (
              <div>
                <label htmlFor="agencyName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Agency Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="agencyName"
                  {...register('agencyName', {
                    required: 'Agency name is required for morning sessions'
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                {errors.agencyName && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.agencyName.message}</p>
                )}
              </div>
            )}

            {/* Language Selection - Only for evening sessions */}
            {!isDaytimeSession && (
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Preferred Language <span className="text-red-500">*</span>
                </label>
                <select
                  id="language"
                  {...register('language', {
                    required: 'Language selection is required for evening sessions'
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
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