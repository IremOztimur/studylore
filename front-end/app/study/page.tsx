import Header from '../../components/Header'
// import Navigation from '../../components/Navigation'
import MainContent from '../../components/MainContent'
import QuickNotes from '../../components/QuickNotes'
import Quiz from '../../components/Quiz'
import Footer from '../../components/Footer'
import DarkModeToggle from '../../components/DarkModeToggle'

export default function StudyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-blue-900 text-gray-800 dark:text-gray-200">
      <div className="container mx-auto px-4 py-8">
        <DarkModeToggle />
        <Header />
        <div className="flex flex-col lg:flex-row gap-8 mt-8">
          {/* <Navigation /> */}
          <MainContent />
          <QuickNotes />
        </div>
        <Quiz />
        <Footer />
      </div>
    </div>
  )
}

