import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { useState } from 'react'
import LoginScreen from './screens/LoginScreen'
import CourseDetailScreen from './screens/CourseDetailScreen'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import ChapterScreen from './screens/ChapterScreen'
import PrivateRoute from './components/PrivateRoute'
import SwipeTradeScreen from './screens/SwipeTradeScreen'
import UsersScreen from './screens/UsersScreen' // New import
import { Toaster } from 'react-hot-toast'
import MainLayout from './components/Layout/MainLayout'
import { Language } from './constants/interfaces'
import './styles/globals.css'
import './styles/users.css' // Import the new CSS
import DashboardScreen from './screens/DashboardScreen'
import CoursesScreen from './screens/CourseScreen'
import AnalyticsScreen from './components/analytics/AnalyticsScreen'

const AppContent = () => {
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'
  
  // State for layout actions
  const [searchTerm, setSearchTerm] = useState('')
  const [language, setLanguage] = useState<Language>('ua')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const handleCreateCourse = () => {
    // This will be handled by each individual screen
  }

  const handleCreateAdmin = () => {
    // Navigate to users page instead of showing modal
    window.location.href = '/users'
  }

  const handleOpenSwipeTrade = () => {
    window.location.href = '/swipetrade'
  }

  const handleOpenUsers = () => {
    window.location.href = '/users'
  }

  return (
    <div className="app">
      {isLoginPage ? (
        <Routes>
          <Route path="/login" element={<LoginScreen />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <MainLayout
          onCreateCourse={handleCreateCourse}
          onCreateAdmin={handleCreateAdmin}
          onOpenSwipeTrade={handleOpenSwipeTrade}
          onOpenUsers={handleOpenUsers} // Add this prop to MainLayout
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          language={language}
          onLanguageChange={setLanguage}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        >
          <Routes>
            {/* Главная страница админки - дашборд */}
            <Route
              path="/admin"
              element={<PrivateRoute element={<DashboardScreen />} />}
            />
            
            {/* Страница со списком всех курсов */}
            <Route
              path="/courses"
              element={
                <PrivateRoute
                  element={
                    <CoursesScreen
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      language={language}
                      onLanguageChange={setLanguage}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                    />
                  }
                />
              }
            />
            
            {/* Страница управления пользователями */}
            <Route
              path="/users"
              element={
                <PrivateRoute
                  element={
                    <UsersScreen
                      searchTerm={searchTerm}
                      onSearchChange={setSearchTerm}
                      language={language}
                      onLanguageChange={setLanguage}
                      viewMode={viewMode}
                      onViewModeChange={setViewMode}
                    />
                  }
                />
              }
            />
            
            {/* Страница конкретного курса с главами */}
            <Route
              path="/course/:courseId"
              element={<PrivateRoute element={<CourseDetailScreen />} />}
            />
            
            {/* Страница конкретной главы с уроками */}
            <Route
              path="/chapter/:courseId/:chapterId"
              element={<PrivateRoute element={<ChapterScreen />} />}
            />
            
            {/* Analytics */}
            <Route
              path="/analytics"
              element={<PrivateRoute element={<AnalyticsScreen />} />}
            />
            
            {/* Swipe Trade */}
            <Route
              path="/swipetrade"
              element={<PrivateRoute element={<SwipeTradeScreen />} />}
            />
            
            {/* Login */}
            <Route path="/login" element={<LoginScreen />} />
            
            {/* Redirect to admin by default */}
            <Route path="/" element={<Navigate to="/admin" />} />
            <Route path="*" element={<Navigate to="/admin" />} />
          </Routes>
        </MainLayout>
      )}
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333439',
            color: '#EAECEF',
            border: '1px solid #515155',
          },
        }}
      />
    </div>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <AppContent />
      </Router>
    </Provider>
  )
}

export default App