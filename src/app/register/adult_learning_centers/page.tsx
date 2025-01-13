import RegistrationForm from '@/components/RegistrationForm';

export default function AdultLearningCentersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-blue-800 dark:text-blue-200 text-center mb-8">
            Adult Learning Centers Registration
          </h1>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <RegistrationForm programId="adult_learning_centers" />
          </div>
        </div>
      </div>
    </div>
  );
} 