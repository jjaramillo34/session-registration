"use client";
import { useForm } from "react-hook-form";
import { FormData } from "@/types";
import { SESSION_DATES } from "@/constants";
import { useState, useEffect } from "react";
import { Calendar, User, Mail, Building2, CheckCircle } from "lucide-react";
import ThankYouModal from './ThankYouModal';
import { useRouter } from 'next/navigation';
import { formatTime } from '@/lib/utils';

interface TimeSlot {
  id: number;
  date: string;
  time: string;
  available: boolean;
  sessionType: string;
}

export default function RegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<FormData>();

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      try {
        const response = await fetch('/api/slots/available');
        const data = await response.json();
        setAvailableSlots(data.slots);
      } catch (error) {
        console.error('Failed to fetch available slots:', error);
      }
    };

    fetchAvailableSlots();
  }, []);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      // Format the data before sending
      const formattedData = {
        name: data.name.trim(),
        email: data.email.toLowerCase().trim(),
        programName: data.programName.trim(),
        daytimeSession1: {
          date: data.daytimeSession1Date,
          time: data.daytimeSession1Time
        },
        eveningSession: {
          date: data.eveningSessionDate,
          time: data.eveningSessionTime
        }
      };

      console.log('📝 Sending registration data:', formattedData);

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formattedData),
      });
      
      const responseData = await response.json();
      console.log('📥 Received response:', responseData);

      if (response.ok) {
        setSubmitStatus('success');
        setIsModalOpen(true);
        reset();
        setTimeout(() => {
          router.push('/sessions');
        }, 2000);
      } else {
        throw new Error(responseData.error || 'Registration failed');
      }
    } catch (error) {
      console.error('❌ Registration failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvailableSlots = (type: 'daytime' | 'evening', selectedDate: string | undefined) => {
    if (!selectedDate) return null;
    
    return availableSlots
      .filter(slot => slot.sessionType === type && slot.date === selectedDate)
      .map(slot => (
        <option key={slot.time} value={slot.time}>
          {formatTime(slot.time)}
        </option>
      ));
  };

  return (
    <>
      <div className="w-full max-w-5xl p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg transition-all">
        <h2 className="text-3xl font-bold mb-4 text-center text-gray-800 dark:text-white">
          Session Registration
        </h2>

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

        {submitStatus === 'success' && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Registration successful! Thank you for registering.</span>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg">
            Registration failed. Please try again.
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Personal Information Section */}
            <div className="space-y-6 md:px-4">
              <div className="relative">
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  <User className="w-4 h-4" />
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("name", { 
                    required: "Full Name is required",
                    minLength: { value: 2, message: "Name must be at least 2 characters" },
                    pattern: { 
                      value: /^[a-zA-Z\s'-]+$/,
                      message: "Please enter a valid name (letters, spaces, hyphens and apostrophes only)"
                    }
                  })}
                  className={`w-full px-4 py-3 border ${errors.name ? 'border-red-500' : 'border-gray-200'} dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  <Mail className="w-4 h-4" />
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("email", {
                    required: "Email address is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@schools\.nyc\.gov$/i,
                      message: "Please enter a valid @schools.nyc.gov email address"
                    }
                  })}
                  type="email"
                  className={`w-full px-4 py-3 border ${errors.email ? 'border-red-500' : 'border-gray-200'} dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all`}
                  placeholder="your.email@schools.nyc.gov"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                )}
              </div>

              <div className="relative">
                <label htmlFor="programName" className="flex items-center gap-2 text-sm font-medium mb-2 text-gray-700 dark:text-gray-200">
                  <Building2 className="w-4 h-4" />
                  Program Name <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("programName", { 
                    required: "Program name is required",
                    minLength: { value: 2, message: "Program name must be at least 2 characters" },
                    maxLength: { value: 100, message: "Program name must not exceed 100 characters" }
                  })}
                  className={`w-full px-4 py-3 border ${errors.programName ? 'border-red-500' : 'border-gray-200'} dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white transition-all`}
                  placeholder="Enter your program name"
                />
                {errors.programName && (
                  <p className="text-red-500 text-sm mt-1">{errors.programName.message}</p>
                )}
              </div>
            </div>

            {/* Session Selection Section */}
            <div className="space-y-6 md:px-4">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 font-medium text-gray-800 dark:text-white">
                  <Calendar className="w-5 h-5" />
                  Session Selection
                </h3>

                {/* Daytime Sessions */}
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Daytime Session <span className="text-red-500">*</span></p>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        {...register("daytimeSession1Date", { required: "Date is required" })}
                        className={`px-3 py-2 border ${errors.daytimeSession1Date ? 'border-red-500' : 'border-gray-200'} dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                      >
                        <option value="">Select Date</option>
                        {SESSION_DATES.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <select
                        {...register("daytimeSession1Time", { required: "Time is required" })}
                        className={`px-3 py-2 border ${errors.daytimeSession1Time ? 'border-red-500' : 'border-gray-200'} dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                        disabled={!watch('daytimeSession1Date')}
                      >
                        <option value="">Select Time</option>
                        {watch('daytimeSession1Date') && getAvailableSlots('daytime', watch('daytimeSession1Date'))}
                      </select>
                    </div>
                    {(errors.daytimeSession1Date || errors.daytimeSession1Time) && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.daytimeSession1Date?.message || errors.daytimeSession1Time?.message}
                      </p>
                    )}
                  </div>

                  {/* Evening Session */}
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg space-y-3">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-200">Evening Session <span className="text-red-500">*</span></p>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        {...register("eveningSessionDate", { required: "Date is required" })}
                        className={`px-3 py-2 border ${errors.eveningSessionDate ? 'border-red-500' : 'border-gray-200'} dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                      >
                        <option value="">Select Date</option>
                        {SESSION_DATES.map(({ value, label }) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <select
                        {...register("eveningSessionTime", { required: "Time is required" })}
                        className={`px-3 py-2 border ${errors.eveningSessionTime ? 'border-red-500' : 'border-gray-200'} dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
                        disabled={!watch('eveningSessionDate')}
                      >
                        <option value="">Select Time</option>
                        {watch('eveningSessionDate') && getAvailableSlots('evening', watch('eveningSessionDate'))}
                      </select>
                    </div>
                    {(errors.eveningSessionDate || errors.eveningSessionTime) && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.eveningSessionDate?.message || errors.eveningSessionTime?.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-md mx-auto pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </>
              ) : (
                'Complete Registration'
              )}
            </button>
          </div>
        </form>
      </div>
      
      <ThankYouModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
} 