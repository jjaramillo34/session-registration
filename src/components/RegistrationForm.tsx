"use client";
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { D79_PROGRAMS } from '@/lib/constants';

interface RegistrationFormData {
  name: string;
  email: string;
  programName: string;
  daytimeSession1: {
    date: string;
    time: string;
  };
  daytimeSession2: {
    date: string;
    time: string;
  };
  eveningSession: {
    date: string;
    time: string;
  };
}

interface TimeSlot {
  date: string;
  time: string;
  available: boolean;
  sessionType: 'daytime' | 'evening';
  capacity: number;
}

interface RegistrationFormProps {
  programId?: string;
}

export default function RegistrationForm({ programId }: RegistrationFormProps) {
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors
  } = useForm<RegistrationFormData>();

  // Set the program name based on the programId if provided
  useEffect(() => {
    if (programId) {
      setValue('programName', programId);
    }
  }, [programId, setValue]);

  // Watch daytime session dates for validation
  const daytimeSession1Date = watch('daytimeSession1.date');
  const daytimeSession2Date = watch('daytimeSession2.date');

  // Validate daytime sessions are on different dates
  useEffect(() => {
    if (daytimeSession1Date && daytimeSession2Date && daytimeSession1Date === daytimeSession2Date) {
      setError('daytimeSession2.date', {
        type: 'manual',
        message: 'Second daytime session must be on a different date'
      });
    } else {
      clearErrors('daytimeSession2.date');
    }
  }, [daytimeSession1Date, daytimeSession2Date, setError, clearErrors]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchAvailableSlots = async () => {
    try {
      setIsLoading(true);
      // Add cache-busting timestamp to URL
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/slots/available?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache'
        }
      });
      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }
      console.log('Available slots:', data.slots);
      console.log('Unique dates:', [...new Set(data.slots.map((slot: TimeSlot) => slot.date))]);
      console.log('Daytime slots:', data.slots.filter((slot: TimeSlot) => slot.sessionType === 'daytime'));
      console.log('Evening slots:', data.slots.filter((slot: TimeSlot) => slot.sessionType === 'evening'));
      setAvailableSlots(data.slots || []);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
      setAvailableSlots([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchAvailableSlots();
    }
  }, [isClient]);

  const onSubmit = async (data: RegistrationFormData) => {
    try {
      setFormError(null);
      setIsLoading(true);
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to register');
      }

      // Refresh available slots immediately after successful registration
      await fetchAvailableSlots();

      // Show success modal
      setShowSuccessModal(true);
      
      // Redirect to homepage after a delay
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (error) {
      console.error('Registration failed:', error);
      setFormError(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const daytimeSlots = availableSlots.filter(slot => 
    slot.sessionType === 'daytime'
  );

  const eveningSlots = availableSlots.filter(slot => 
    slot.sessionType === 'evening'
  );

  const formatDate = (dateString: string) => {
    console.log('Formatting date:', dateString);
    // Create date with explicit year, month, day to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(num => parseInt(num));
    const date = new Date(year, month - 1, day); // month is 0-based in Date constructor
    const formatted = date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'  // Use UTC to avoid timezone shifts
    });
    console.log('Formatted date:', formatted);
    return formatted;
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric',
      minute: '2-digit',
      hour12: true 
    });
  };

  if (!isClient) {
    return (
      <div className="w-full max-w-5xl p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        <div className="flex items-center justify-center p-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900">
                <svg className="h-6 w-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">Registration Successful!</h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Thank you for registering. You will be redirected to the homepage shortly.
              </p>
            </div>
          </div>
        </div>
      )}

      <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white">
        Session Registration
      </h2>

      {/* Add error message display */}
      {formError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
          {formError}
        </div>
      )}

      <div className="mb-8 text-gray-600 dark:text-gray-300 space-y-4 max-w-3xl mx-auto">
        <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
          <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Instructions:</h3>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Please select two daytime sessions that you will host. The audience for these sessions will be NYCPS staff.</li>
            <li>Please select one evening session that you will host. The audience for this session will be community members and partners.</li>
            <li>Each session will last 30 minutes.</li>
            <li>Note: Please ensure to mark the session with your Program name.</li>
          </ul>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'Full name is required' })}
                className="form-input mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                    value: /@schools\.nyc\.gov$/,
                    message: 'Must be a @schools.nyc.gov email address'
                  }
                })}
                className="form-input mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="programName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Program
              </label>
              <select
                id="programName"
                {...register('programName', { required: 'Program is required' })}
                className="form-select mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select a program</option>
                {D79_PROGRAMS.map((program) => (
                  <option key={program} value={program}>
                    {program}
                  </option>
                ))}
              </select>
              {errors.programName && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.programName.message}</p>
              )}
            </div>
          </div>

          {/* Session Selection Section */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">First Daytime Session</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="daytimeSession1Date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <select
                    id="daytimeSession1Date"
                    {...register('daytimeSession1.date', { required: 'Date is required' })}
                    className="form-select mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a date</option>
                    {[...new Set(daytimeSlots.map(slot => slot.date))].map(date => (
                      <option key={date} value={date}>
                        {formatDate(date)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="daytimeSession1Time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Time
                  </label>
                  <select
                    id="daytimeSession1Time"
                    {...register('daytimeSession1.time', { required: 'Time is required' })}
                    className="form-select mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a time</option>
                    {daytimeSlots
                      .filter(slot => slot.date === watch('daytimeSession1.date'))
                      .map(slot => (
                        <option key={slot.time} value={slot.time}>
                          {formatTime(slot.time)} ({slot.capacity} spots left)
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Second Daytime Session</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="daytimeSession2Date" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <select
                    id="daytimeSession2Date"
                    {...register('daytimeSession2.date', { 
                      required: 'Date is required',
                      validate: value => 
                        value !== daytimeSession1Date || 'Second daytime session must be on a different date'
                    })}
                    className="form-select mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a date</option>
                    {[...new Set(daytimeSlots.map(slot => slot.date))].map(date => (
                      <option key={date} value={date}>
                        {formatDate(date)}
                      </option>
                    ))}
                  </select>
                  {errors.daytimeSession2?.date && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.daytimeSession2.date.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="daytimeSession2Time" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Time
                  </label>
                  <select
                    id="daytimeSession2Time"
                    {...register('daytimeSession2.time', { required: 'Time is required' })}
                    className="form-select mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a time</option>
                    {daytimeSlots
                      .filter(slot => slot.date === watch('daytimeSession2.date'))
                      .map(slot => (
                        <option key={slot.time} value={slot.time}>
                          {formatTime(slot.time)} ({slot.capacity} spots left)
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Evening Session</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="eveningSessionDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Date
                  </label>
                  <select
                    id="eveningSessionDate"
                    {...register('eveningSession.date', { required: 'Date is required' })}
                    className="form-select mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a date</option>
                    {[...new Set(eveningSlots.map(slot => slot.date))].map(date => (
                      <option key={date} value={date}>
                        {formatDate(date)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="eveningSessionTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Time
                  </label>
                  <select
                    id="eveningSessionTime"
                    {...register('eveningSession.time', { required: 'Time is required' })}
                    className="form-select mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="">Select a time</option>
                    {eveningSlots
                      .filter(slot => slot.date === watch('eveningSession.date'))
                      .map(slot => (
                        <option key={slot.time} value={slot.time}>
                          {formatTime(slot.time)} ({slot.capacity} spots left)
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Registering...
              </>
            ) : (
              'Complete Registration'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 