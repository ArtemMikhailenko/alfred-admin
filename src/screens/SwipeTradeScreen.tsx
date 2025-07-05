import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  TrendingUp,
  BarChart3,
  Settings,
  Search,
  Filter,
  SortDesc,
  Grid,
  List,
  Activity,
  Target,
  Zap,
  Award,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  Clock,
  Users
} from 'lucide-react'
import { Language } from '../constants/interfaces'
import {
  DeleteSwipeTrade,
  GetAllSwipeTrade,
  GetSwipeTradeStatistics
} from '../actions/actions'
import CreateChartQuizModal from '../components/chartQuiz/CreateChartQuizModal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import { SwipeTradeQuizInterface } from '../components/chartQuiz/functions'
import { TokensState } from '../redux/tokens'
import { ReloginAndRetry } from '../components/ReloginAndRetry'
import LanguageSelectorBlock from '../components/LanguageSelectorBlock'
import toast from 'react-hot-toast'
import styles from './SwipeTradeScreen.module.css'

export function promptPassword(): Promise<string | null> {
  return new Promise((resolve) => {
    const password = window.prompt(
      'Your session expired. Please enter your password to continue:'
    )
    resolve(password)
  })
}

const SwipeTradeScreen: React.FC = () => {
  const tokens: TokensState = useSelector((state: RootState) => state.tokens)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [quizzes, setQuizzes] = useState<SwipeTradeQuizInterface[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statistics, setStatistics] = useState<any>(null)

  const [modal, setModal] = useState<boolean>(false)
  const [language, setLanguage] = useState<Language>('ua')
  const [currentQuiz, setCurrentQuiz] = useState<SwipeTradeQuizInterface | null>(null)
  
  // Filters and search
  const [searchTerm, setSearchTerm] = useState('')
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'inactive'>('all')
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'points'>('date')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const loadSwipeTradeData = async () => {
    if (!tokens.accessToken || !tokens.email) return

    setIsLoading(true)
    setError(null)

    try {
      const tryPost = async (accessToken: string): Promise<boolean> => {
        const [quizzesResponse, statsResponse] = await Promise.all([
          GetAllSwipeTrade(accessToken),
          GetSwipeTradeStatistics(accessToken).catch(() => null)
        ])

        if (quizzesResponse.error && quizzesResponse.statusCode === 401) {
          return false
        }

        if (quizzesResponse.quizzes) {
          setQuizzes(quizzesResponse.quizzes)
        }

        if (statsResponse && !statsResponse.error) {
          setStatistics(statsResponse)
        }

        return true
      }

      const success = await tryPost(tokens.accessToken)
      if (!success) {
        await ReloginAndRetry(tokens.email, dispatch, tryPost)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load swipe trade data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadSwipeTradeData()
  }, [modal])

  // Filtered and sorted quizzes
  const filteredQuizzes = useMemo(() => {
    let filtered = quizzes.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           quiz.description[language]?.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'active' && quiz.isActive) ||
                           (filterBy === 'inactive' && !quiz.isActive)
      
      return matchesSearch && matchesFilter
    })

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'points':
          return b.settings.points - a.settings.points
        case 'date':
          return new Date(b.updatedAt || b.createdAt).getTime() - 
                 new Date(a.updatedAt || a.createdAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [quizzes, searchTerm, filterBy, sortBy, language])

  const handleCreateQuiz = () => {
    setCurrentQuiz(null)
    setModal(true)
  }

  const handleEditQuiz = (quiz: SwipeTradeQuizInterface) => {
    setCurrentQuiz(quiz)
    setModal(true)
  }

  const handleDeleteQuiz = async (quiz: SwipeTradeQuizInterface) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${quiz.title}"?\n\nThis action cannot be undone.`
    )

    if (confirmDelete && quiz.id && tokens.accessToken && tokens.email) {
      try {
        const tryDelete = async (accessToken: string): Promise<boolean> => {
          const response = await DeleteSwipeTrade(quiz.id, accessToken)
          if (response.error) return false
          
          toast.success('Quiz deleted successfully')
          loadSwipeTradeData()
          return true
        }

        const success = await tryDelete(tokens.accessToken)
        if (!success) {
          await ReloginAndRetry(tokens.email, dispatch, tryDelete)
        }
      } catch (error) {
        toast.error('Failed to delete quiz')
      }
    }
  }

  const handleModalClose = (isUpdated: boolean) => {
    if (isUpdated) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      )
      if (confirmClose) {
        setModal(false)
      }
    } else {
      setModal(false)
    }
  }

  const handleBackToAdmin = () => {
    navigate('/admin')
  }

  // Statistics calculations
  const totalQuizzes = quizzes.length
  const activeQuizzes = quizzes.filter(q => q.isActive).length
  const totalPoints = quizzes.reduce((sum, q) => sum + q.settings.points, 0)
  const avgPoints = totalQuizzes > 0 ? Math.round(totalPoints / totalQuizzes) : 0

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Loading swipe trade quizzes...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Error Loading Data</h3>
          <p className={styles.errorText}>{error}</p>
          <div className={styles.errorActions}>
            <button onClick={loadSwipeTradeData} className={styles.retryButton}>
              Try Again
            </button>
            <button onClick={handleBackToAdmin} className={styles.backButton}>
              <ArrowLeft size={16} />
              Back to Admin
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button onClick={handleBackToAdmin} className={styles.backButton}>
              <ArrowLeft size={20} />
              <span>Back to Admin</span>
            </button>
            <div className={styles.headerDivider} />
            <div>
              <h1 className={styles.headerTitle}>Swipe Trade</h1>
              <p className={styles.headerSubtitle}>Trading Quiz Management</p>
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <LanguageSelectorBlock language={language} setLanguage={setLanguage} />
            <button className={styles.settingsButton}>
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <div className={styles.heroHeader}>
                <div className={styles.heroIcon}>
                  <TrendingUp size={28} />
                </div>
                <div>
                  <h2 className={styles.heroTitle}>Swipe Trade Quizzes</h2>
                  <p className={styles.heroDescription}>
                    Create and manage interactive trading quizzes with real market data
                  </p>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statBlue}`}>
                    <BarChart3 size={18} />
                    <span>Total Quizzes</span>
                  </div>
                  <div className={`${styles.statValue} ${styles.statBlue}`}>
                    {totalQuizzes}
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statGreen}`}>
                    <CheckCircle2 size={18} />
                    <span>Active</span>
                  </div>
                  <div className={`${styles.statValue} ${styles.statGreen}`}>
                    {activeQuizzes}
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statPurple}`}>
                    <Target size={18} />
                    <span>Avg Points</span>
                  </div>
                  <div className={`${styles.statValue} ${styles.statPurple}`}>
                    {avgPoints}
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statOrange}`}>
                    <Activity size={18} />
                    <span>Completion</span>
                  </div>
                  <div className={`${styles.statValue} ${styles.statOrange}`}>
                    {statistics?.completionRate || 0}%
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.sidebar}>
              <div className={styles.actionCard}>
                <h3 className={styles.actionHeader}>
                  <Zap size={20} />
                  Quick Actions
                </h3>
                <div className={styles.actionButtons}>
                  <button onClick={handleCreateQuiz} className={styles.primaryButton}>
                    <Plus size={20} />
                    Create New Quiz
                  </button>
                  <button className={styles.secondaryButton}>
                    <BarChart3 size={20} />
                    View Analytics
                  </button>
                  <button className={styles.secondaryButton}>
                    <Award size={20} />
                    Export Results
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div className={styles.controlsSection}>
        <div className={styles.controlsLeft}>
          <div className={styles.searchContainer}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <div className={styles.filterGroup}>
            <Filter size={16} />
            <select 
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value as any)}
              className={styles.select}
            >
              <option value="all">All Quizzes</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          
          <div className={styles.sortGroup}>
            <SortDesc size={16} />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className={styles.select}
            >
              <option value="date">Sort by Date</option>
              <option value="title">Sort by Title</option>
              <option value="points">Sort by Points</option>
            </select>
          </div>
        </div>

        <div className={styles.controlsRight}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </button>
            <button 
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </button>
          </div>
          
          <span className={styles.resultsCount}>
            {filteredQuizzes.length} of {totalQuizzes} quizzes
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className={styles.contentSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>Trading Quizzes</h3>
            <p className={styles.sectionDescription}>
              Manage your swipe trade quiz collection
            </p>
          </div>
          <button onClick={handleCreateQuiz} className={styles.addButton}>
            <Plus size={16} />
            Add Quiz
          </button>
        </div>

        {filteredQuizzes.length > 0 ? (
          <div className={`${styles.quizGrid} ${viewMode === 'list' ? styles.quizList : ''}`}>
            {filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className={`${styles.quizCard} ${!quiz.isActive ? styles.inactive : ''}`}
              >
                <div className={styles.quizContent}>
                  <div className={styles.quizHeader}>
                    <div className={styles.quizTitleRow}>
                      <h4 className={styles.quizTitle}>{quiz.title}</h4>
                      <div className={styles.quizStatus}>
                        {quiz.isActive ? (
                          <CheckCircle2 size={16} className={styles.statusActive} />
                        ) : (
                          <Circle size={16} className={styles.statusInactive} />
                        )}
                      </div>
                    </div>
                    
                    <div className={styles.quizMeta}>
                      <span className={styles.metaItem}>
                        <Target size={12} />
                        {quiz.settings.points} points
                      </span>
                      <span className={styles.metaItem}>
                        <BarChart3 size={12} />
                        {quiz.settings.pair}
                      </span>
                      <span className={styles.metaItem}>
                        <Clock size={12} />
                        {quiz.settings.timeframe}
                      </span>
                    </div>
                  </div>

                  <div className={styles.quizDescription}>
                    <p>{quiz.description[language]?.substring(0, 100)}...</p>
                  </div>

                  <div className={styles.quizActions}>
                    <button
                      onClick={() => handleEditQuiz(quiz)}
                      className={styles.actionButton}
                    >
                      <Edit size={14} />
                      Edit
                    </button>
                   
                    <button
                      onClick={() => handleDeleteQuiz(quiz)}
                      className={`${styles.actionButton} ${styles.danger}`}
                    >
                      <Trash2 size={14} />
                      Delete
                    </button>
                  </div>
                </div>

                {/* Quiz Chart Preview */}
                <div className={styles.quizPreview}>
                  <div className={styles.chartPlaceholder}>
                    <TrendingUp size={24} className={styles.chartIcon} />
                    <span className={styles.chartLabel}>Chart Preview</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <TrendingUp size={64} />
            </div>
            <h4 className={styles.emptyTitle}>
              {searchTerm ? 'No quizzes found' : 'No trading quizzes yet'}
            </h4>
            <p className={styles.emptyDescription}>
              {searchTerm 
                ? `No quizzes match "${searchTerm}"`
                : 'Start creating interactive trading quizzes with real market data'
              }
            </p>
            <button onClick={handleCreateQuiz} className={styles.emptyButton}>
              <Plus size={18} />
              Create First Quiz
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <CreateChartQuizModal
              initialValue={currentQuiz}
              onClose={handleModalClose}
              tokens={tokens}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default SwipeTradeScreen