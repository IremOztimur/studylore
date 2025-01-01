import UrlForm from '../components/UrlForm'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-blue-900">
      <main className="flex-grow flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading text-gray-800 dark:text-gray-100">Study Lore </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-600 dark:text-gray-300 font-heading">Transform tutorials into study-friendly guides</p>
          <UrlForm />
          <p className="mt-8 text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Paste a tutorial URL and let us optimize it for your learning experience.
          </p>
        </div>
      </main>
      <footer className="py-4 text-center text-gray-500 dark:text-gray-400">
        <p>&copy; 2025 Study Lore . All rights reserved.</p>
        <nav className="mt-2">
          <Link href="#" className="text-blue-500 hover:underline mx-2">About</Link>
          <Link href="#" className="text-blue-500 hover:underline mx-2">Contact</Link>
          <Link href="#" className="text-blue-500 hover:underline mx-2">Privacy Policy</Link>
        </nav>
      </footer>
    </div>
  )
}

