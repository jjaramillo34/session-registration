'use client'
 
import { useEffect } from 'react'
import Link from 'next/link'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Error details:', error)
    console.error('Error message:', error.message)
    console.error('Error stack:', error.stack)
  }, [error])
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-100 to-white dark:from-blue-900 dark:to-gray-900">
      <div className="text-center max-w-md mx-auto px-4">
        <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">We apologize for the inconvenience.</p>
        {process.env.NODE_ENV === 'development' && (
          <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">Error Details:</p>
            <p className="text-xs text-red-700 dark:text-red-300 font-mono break-all">{error.message}</p>
            {error.stack && (
              <details className="mt-2">
                <summary className="text-xs text-red-600 dark:text-red-400 cursor-pointer">Stack Trace</summary>
                <pre className="text-xs text-red-700 dark:text-red-300 mt-2 overflow-auto max-h-40">{error.stack}</pre>
              </details>
            )}
          </div>
        )}
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-block"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
} 