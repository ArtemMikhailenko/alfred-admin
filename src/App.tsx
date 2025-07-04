import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { useState } from 'react'
import LoginScreen from './screens/LoginScreen'

import CourseScreen from './screens/CourseScreen'
import { Provider } from 'react-redux'
import { store } from './redux/store'
import ChapterScreen from './screens/ChapterScreen'
import PrivateRoute from './components/PrivateRoute'
import SwipeTradeScreen from './screens/SwipeTradeScreen'
import { Toaster } from 'react-hot-toast'
import MainLayout from './components/Layout/MainLayout'
import { Language } from './constants/interfaces'
import './styles/globals.css'
import DashboardScreen from './screens/DashboardScreen'
import CoursesScreen from './screens/CourseScreen'

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
    // This will be handled by each individual screen
  }

  const handleOpenSwipeTrade = () => {
    window.location.href = '/swipetrade'
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
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          language={language}
          onLanguageChange={setLanguage}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        >
          <Routes>
            <Route
              path="/admin"
              element={<PrivateRoute element={<DashboardScreen />} />}
            />
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
            <Route
              path="/swipetrade"
              element={<PrivateRoute element={<SwipeTradeScreen />} />}
            />
            <Route
              path="/course/:courseId"
              element={<PrivateRoute element={<CourseScreen />} />}
            />
            <Route
              path="/chapter/:courseId/:chapterId"
              element={<PrivateRoute element={<ChapterScreen />} />}
            />
            <Route path="/login" element={<LoginScreen />} />
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