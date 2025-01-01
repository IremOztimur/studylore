import Link from 'next/link'

export default function Header() {
  return (
    <header className="text-center mb-8">
      <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block">
        ← Back to Home
      </Link>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">Understanding Neural Networks</h1>
      <p className="text-xl text-gray-600 dark:text-gray-400">
        A comprehensive guide to the fundamentals of neural networks and their applications
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
        Source: LearnBetter Framework | Last Updated: June 2023
      </p>
    </header>
  )
}

