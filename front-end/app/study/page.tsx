import Header from '../../components/Header'
import MainContent from '../../components/MainContent'
import QuickNotes from '../../components/QuickNotes'
import Quiz from '../../components/Quiz'
import Footer from '../../components/Footer'
import DarkModeToggle from '../../components/DarkModeToggle'

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50 to-blue-100 dark:from-sky-950 dark:via-cyan-950 dark:to-blue-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <DarkModeToggle />
        <Header />
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          <MainContent />
          <QuickNotes />
        </div>
        <Quiz />
        <Footer />
      </div>
    </div>
  )
}

