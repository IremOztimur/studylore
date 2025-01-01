'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UrlForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [url, setUrl] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Placeholder for API call
      // const response = await fetch('/api/process-url', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ url }),
      // })

      // if (response.ok) {
      //   // Navigate to the study page
      //   router.push('/study')
      // } else {
      //   throw new Error('Failed to process URL')
      // }
      console.log('Attempting to navigate to /study...')
      router.push('/study')
      console.log('Navigation called')
    } catch (error) {
      console.error('Error processing URL:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex shadow-md rounded-lg overflow-hidden transition-all duration-300 focus-within:shadow-lg">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter tutorial URL"
          required
          className="flex-grow px-4 py-2 focus:outline-none text-gray-700"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-6 py-2 font-semibold hover:bg-blue-600 transition-colors duration-300 disabled:bg-blue-300"
        >
          {isLoading ? 'Processing...' : 'Process'}
        </button>
      </div>
    </form>
  )
}

