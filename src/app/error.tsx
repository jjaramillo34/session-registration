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
    console.error(error)
  }, [error])
 
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-800 mb-4">Something went wrong!</h2>
        <p className="text-gray-600 mb-8">We apologize for the inconvenience.</p>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
} 