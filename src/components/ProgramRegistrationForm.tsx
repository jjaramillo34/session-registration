'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { formatDate, formatTime } from '@/lib/utils';

interface TimeSlot {
  id: number;
  date: string;
  time: string;
  capacity: number;
  sessionType: 'daytime' | 'evening';
}

interface ProgramRegistrationFormProps {
  programName: string;
  timeSlot: TimeSlot;
  onSuccess: () => void;
  onCancel: () => void;
}

interface RegistrationFormData {
  name: string;
  email: string;
  phoneNumber?: string;
  schoolDBN?: string;
  role?: string;
}

export default function ProgramRegistrationForm({
  programName,
  timeSlot,
  onSuccess,
  onCancel
}: ProgramRegistrationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<RegistrationFormData>();

  const email = watch('email');
  const isNYCPSEmail = email?.toLowerCase().endsWith('@schools.nyc.gov');
  const isDaytimeSession = timeSlot.sessionType === 'daytime';

  // Validate if user can register for this session
  if (isDaytimeSession && !isNYCPSEmail && email) {
    return (
      <div className="bg-red-50 dark:bg-red-900/30 p-6 rounded-lg text-center">
        <p className="text-red-800 dark:text-red-200 font-medium">
          Daytime sessions are only available for NYCPS staff members with @schools.nyc.gov email addresses.
        </p>
        <button
          onClick={onCancel}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    );
  }

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setIsSubmitting(true);
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
          isNYCPSStaff: isNYCPSEmail
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to register');
      }

      onSuccess();
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to register');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-blue-800 dark:text-blue-200">
          Session Details
        </h3>
        <p className="text-blue-600 dark:text-blue-400">
          {programName} - {formatDate(timeSlot.date)} at {formatTime(timeSlot.time)}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-lg">
          <p className="text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            {...register('name', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              },
              validate: {
                nycpsEmail: value => {
                  if (isDaytimeSession && !value.toLowerCase().endsWith('@schools.nyc.gov')) {
                    return 'Must be a valid @schools.nyc.gov email address for daytime sessions';
                  }
                  return true;
                }
              }
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Phone Number
          </label>
          <input
            type="tel"
            id="phoneNumber"
            {...register('phoneNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {isNYCPSEmail && (
          <>
            <div>
              <label htmlFor="schoolDBN" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                School DBN
              </label>
              <input
                type="text"
                id="schoolDBN"
                {...register('schoolDBN')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Role at School
              </label>
              <input
                type="text"
                id="role"
                {...register('role')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          {isSubmitting ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
} 