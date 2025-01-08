'use client'

import { useState, useEffect } from 'react'

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    // Get quiz questions from localStorage
    const storedData = localStorage.getItem("mainContent");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.quiz_questions && parsedData.quiz_questions.length > 0) {
        setQuestions(parsedData.quiz_questions);
      }
    }
  }, []);

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
  }

  const handleSubmit = () => {
    if (selectedAnswer !== null) {
      setShowResult(true)
    }
  }

  const handleNext = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setCurrentQuestion(prev => (prev + 1) % questions.length)
  }

  // Don't render the quiz section if there are no questions
  if (questions.length === 0) {
    return null;
  }

  return (
    <section className="mt-8 bg-white/80 dark:bg-gray-900/90 rounded-xl shadow-lg p-6 border border-slate-200 dark:border-slate-700 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-4">Quick Quiz</h2>
      <div className="mb-4">
        <p className="font-semibold mb-2">{questions[currentQuestion].question}</p>
        <ul className="space-y-2">
          {questions[currentQuestion].options.map((option, index) => (
            <li key={index}>
              <button
                onClick={() => handleAnswer(index)}
                className={`w-full text-left p-3 rounded-lg transition-colors duration-200 ${
                  selectedAnswer === index
                    ? 'bg-blue-100 dark:bg-blue-900 border border-blue-300 dark:border-blue-700'
                    : 'bg-white/90 dark:bg-gray-800/90 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-gray-700/90'
                }`}
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {showResult ? (
        <div className="mb-4">
          <p className={`font-semibold ${
            selectedAnswer === questions[currentQuestion].correctAnswer
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'
          }`}>
            {selectedAnswer === questions[currentQuestion].correctAnswer
              ? 'Correct!'
              : 'Incorrect. Try again!'}
          </p>
        </div>
      ) : null}
      <div className="flex justify-end space-x-4">
        <button
          onClick={handleSubmit}
          disabled={selectedAnswer === null}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 shadow-sm"
        >
          Submit Answer
        </button>
        <button
          onClick={handleNext}
          className="bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Next Question
        </button>
      </div>
    </section>
  )
}

