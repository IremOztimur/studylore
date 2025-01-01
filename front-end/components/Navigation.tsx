'use client'

import { ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'

const sections = [
  { title: 'Introduction', subsections: ['What are Neural Networks?', 'Historical Context'] },
  { title: 'Basic Concepts', subsections: ['Neurons', 'Layers', 'Activation Functions'] },
  { title: 'Training Process', subsections: ['Backpropagation', 'Gradient Descent', 'Loss Functions'] },
  { title: 'Advanced Topics', subsections: ['Convolutional Neural Networks', 'Recurrent Neural Networks', 'Transformers'] },
]

export default function Navigation() {
  const [openSections, setOpenSections] = useState<number[]>([])

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

  return (
    <nav className="w-full lg:w-1/4 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-2xl font-bold mb-4">Table of Contents</h2>
      <ul>
        {sections.map((section, index) => (
          <li key={index} className="mb-2">
            <button
              onClick={() => toggleSection(index)}
              className="flex items-center justify-between w-full text-left font-semibold hover:text-blue-600 dark:hover:text-blue-400"
            >
              {section.title}
              {openSections.includes(index) ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {openSections.includes(index) && (
              <ul className="ml-4 mt-2">
                {section.subsections.map((subsection, subIndex) => (
                  <li key={subIndex} className="mb-1">
                    <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                      {subsection}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}

