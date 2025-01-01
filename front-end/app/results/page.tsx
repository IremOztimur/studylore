import Link from 'next/link'

export default function Results() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-blue-100 p-4">
      <h1 className="text-4xl font-bold mb-4 font-heading">Results</h1>
      <p className="text-xl mb-8 text-gray-600">Your study-friendly guide is ready!</p>
      <Link 
        href="/"
        className="bg-blue-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-colors duration-300"
      >
        Back to Home
      </Link>
    </div>
  )
}

