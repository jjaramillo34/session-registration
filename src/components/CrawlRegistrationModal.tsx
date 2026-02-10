import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { X, MapPin, Calendar, Clock, User, Mail, CheckCircle } from 'lucide-react';
import { formatDate, formatTimeRange } from '@/lib/utils';

interface CrawlRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  crawl: {
    id: string;
    name: string;
    location: string;
    address: string;
    date: string;
    time: string;
    endTime?: string;
    capacity: number;
    description?: string;
    _count?: {
      registrations: number;
    };
  };
}

interface RegistrationFormData {
  name: string;
  email: string;
}

export default function CrawlRegistrationModal({
  isOpen,
  onClose,
  crawl
}: CrawlRegistrationModalProps) {
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

      const response = await fetch('/api/crawls/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          crawlId: crawl.id
        }),
      });

      const result = await response.json();

      if (!response.ok) {
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

  const spotsLeft = crawl.capacity - (crawl._count?.registrations || 0);

  const inputBase =
    'mt-2 block w-full rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-200 dark:border-gray-700">
        {/* Header with accent */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-6 py-5">
          <div className="flex justify-between items-start gap-4">
            <div>
              <h2 className="text-xl font-bold text-white">
                Register for site crawl
              </h2>
              <span className="inline-flex items-center mt-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white">
                {spotsLeft} spots remaining
              </span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Event details card */}
          <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 p-4 space-y-3">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg leading-tight">
              {crawl.name}
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-start gap-2 text-gray-600 dark:text-gray-300">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-blue-500" />
                <span>{crawl.address}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Calendar className="w-4 h-4 flex-shrink-0 text-blue-500" />
                <span>{formatDate(crawl.date)}</span>
              </p>
              <p className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <Clock className="w-4 h-4 flex-shrink-0 text-blue-500" />
                <span>{formatTimeRange(crawl.time, crawl.endTime)}</span>
              </p>
              {crawl.description && (
                <p className="text-gray-600 dark:text-gray-300 pt-1 border-t border-gray-200 dark:border-gray-600 mt-2">
                  {crawl.description}
                </p>
              )}
            </div>
          </div>

          {success ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <p className="font-semibold text-gray-900 dark:text-white">
                You’re registered
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                You’ll receive a confirmation email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <User className="w-4 h-4 text-blue-500" />
                  Full name
                </label>
                <input
                  type="text"
                  id="name"
                  {...register('name', { required: 'Name is required' })}
                  className={`${inputBase} ${errors.name ? 'border-red-400 dark:border-red-500' : ''}`}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  <Mail className="w-4 h-4 text-blue-500" />
                  NYCPS email
                </label>
                <input
                  type="email"
                  id="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@schools\.nyc\.gov$/i,
                      message: 'Must be a valid @schools.nyc.gov email address',
                    },
                  })}
                  className={`${inputBase} ${errors.email ? 'border-red-400 dark:border-red-500' : ''}`}
                  placeholder="username@schools.nyc.gov"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25 transition-all"
                >
                  {isLoading ? 'Registering…' : 'Register'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
} 