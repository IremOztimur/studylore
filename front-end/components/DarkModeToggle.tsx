'use client'

import { useState, useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  return (
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="fixed top-4 right-4 bg-white/90 dark:bg-gray-800/90 p-3 rounded-full shadow-lg border border-slate-200 dark:border-slate-700 backdrop-blur-sm hover:bg-slate-50 dark:hover:bg-gray-700/90 transition-colors duration-200"
    >
      {darkMode ? (
        <Sun size={24} className="text-amber-500" />
      ) : (
        <Moon size={24} className="text-blue-600" />
      )}
    </button>
  )
}

