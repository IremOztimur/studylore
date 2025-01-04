import { Download, Home, Book } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center mb-4 md:mb-0">
          <Download size={20} className="mr-2" />
          Download Review Sheet
        </button>
        <nav className="flex space-x-4">
          <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
            <Home size={20} className="mr-1" />
            Home
          </a>
        </nav>
      </div>
    </footer>
  )
}

