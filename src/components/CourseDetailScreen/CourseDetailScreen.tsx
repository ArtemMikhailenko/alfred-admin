import React, { useEffect, useState } from 'react'
import { 
  ArrowLeft, 
  BookOpen, 
  Plus,
  Users,
  Clock,
  Settings,
  Play,
  Edit,
  Trash2,
  CheckCircle2,
  Circle,
  GraduationCap,
  BarChart3,
  Target,
  Award,
  Eye
} from 'lucide-react'
import { GetCourseById } from '../../actions/actions' // Импортируем API функцию
import { Course, Chapter, Language, LessonWithLanguages } from '../../constants/interfaces'
import styles from './CourseDetailScreen.module.css'
import CreateChapterModal from '../chapter/CreateChapterModal'

interface CourseDetailScreenProps {
  courseId?: string
  onNavigateBack?: () => void
  onNavigateToChapter?: (courseId: string, chapterId: string) => void
}

const CourseDetailScreen: React.FC<CourseDetailScreenProps> = ({
  courseId = '1',
  onNavigateBack,
  onNavigateToChapter
}) => {
  const [course, setCourse] = useState<Course | null>(null)
  const [language, setLanguage] = useState<Language>('ua')
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'chapters' | 'analytics'>('chapters')
  const [error, setError] = useState<string | null>(null)

  // Функция для загрузки курса из API
  const loadCourse = async () => {
    if (!courseId) return
    
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('Loading course with ID:', courseId)
      const response = await GetCourseById(courseId)
      
      if (response.error) {
        setError(response.error)
        console.error('API Error:', response.error)
      } else {
        setCourse(response)
        console.log('Course loaded successfully:', response)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load course'
      setError(errorMessage)
      console.error('Error loading course:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCourse()
  }, [courseId])
  const handleCreateChapter = () => {
    setShowCreateModal(true)
  }

  const handleCloseModal = (isUpdated: boolean) => {
    setShowCreateModal(false)
    // если новая глава создана, можно перезагрузить курс чтобы она сразу отобразилась
    if (isUpdated) {
      loadCourse()
    }
  }
  const handleChapterClick = (chapterId: number) => {
    if (onNavigateToChapter && courseId) {
      onNavigateToChapter(courseId, chapterId.toString())
    } else {
      console.log('Navigate to chapter:', chapterId)
    }
  }



  const handleBackToCourses = () => {
    if (onNavigateBack) {
      onNavigateBack()
    } else {
      console.log('Navigate back to courses')
    }
  }

  // Вычисления для статистики
  const totalLessons = course?.modules?.reduce((acc: number, chapter: Chapter) => 
    acc + (chapter.lessons?.length || 0), 0) || 0

  const completedChapters = course?.modules?.filter((chapter: Chapter) => 
    chapter.lessons && chapter.lessons.length > 0).length || 0

  const progressPercentage = course?.modules?.length 
    ? Math.round((completedChapters / course.modules.length) * 100) 
    : 0

  const totalQuizzes = course?.modules?.reduce((acc: number, chapter: Chapter) => {
    const lessonQuizzes = chapter.lessons?.reduce((lessonAcc: number, lesson: LessonWithLanguages) => 
      lessonAcc + (lesson.quiz?.length || 0), 0) || 0
    const finalTestCount = chapter.finalTest?.length || 0
    return acc + lessonQuizzes + finalTestCount
  }, 0) || 0

  const estimatedDuration = totalLessons * 15 // примерно 15 минут на урок

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Loading course...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Error Loading Course</h3>
          <p className={styles.errorText}>{error}</p>
          <div className={styles.errorActions}>
            <button 
              onClick={loadCourse}
              className={styles.retryButton}
            >
              Try Again
            </button>
            <button 
              onClick={handleBackToCourses}
              className={styles.backButton}
            >
              <ArrowLeft size={16} />
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>📚</div>
          <h3 className={styles.errorTitle}>Course Not Found</h3>
          <p className={styles.errorText}>The course you're looking for doesn't exist or has been removed.</p>
          <button 
            onClick={handleBackToCourses}
            className={styles.backButton}
          >
            <ArrowLeft size={16} />
            Back to Courses
          </button>
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
            <button
              onClick={handleBackToCourses}
              className={styles.backButton}
            >
              <ArrowLeft size={20} />
              <span className={styles.backButtonText}>Back to Courses</span>
            </button>
            <div className={styles.headerDivider} />
            <div>
              <h1 className={styles.headerTitle}>
                {course?.name[language] || 'Course'}
              </h1>
              <p className={styles.headerSubtitle}>Course Management</p>
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <div className={styles.languageSelector}>
              {(['ua', 'en', 'ru'] as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={`${styles.languageButton} ${language === lang ? styles.active : ''}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            
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
                  <BookOpen className={styles.heroIconSvg} size={24} />
                </div>
                <div>
                  <h2 className={styles.heroTitle}>{course?.name[language]}</h2>
                  <p className={styles.heroDescription}>
                    {course?.description[language]}
                  </p>
                </div>
              </div>
              
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statBlue}`}>
                    <BookOpen size={18} />
                    <span className={styles.statLabel}>Chapters</span>
                  </div>
                  <div className={`${styles.statValue} ${styles.statBlue}`}>
                    {course?.modules?.length || 0}
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statGreen}`}>
                    <GraduationCap size={18} />
                    <span className={styles.statLabel}>Lessons</span>
                  </div>
                  <div className={`${styles.statValue} ${styles.statGreen}`}>
                    {totalLessons}
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statPurple}`}>
                    <BarChart3 size={18} />
                    <span className={styles.statLabel}>Quizzes</span>
                  </div>
                  <div className={`${styles.statValue} ${styles.statPurple}`}>
                    {totalQuizzes}
                  </div>
                </div>
                
                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statOrange}`}>
                    <Clock size={18} />
                    <span className={styles.statLabel}>Duration</span>
                  </div>
                  <div className={`${styles.statValue} ${styles.statOrange}`}>
                    ~{Math.round(estimatedDuration / 60)}h
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.sidebar}>
              <div className={styles.progressCard}>
                <h3 className={styles.progressHeader}>
                  <Target className={styles.progressIcon} size={20} />
                  Course Progress
                </h3>
                <div className={styles.progressContent}>
                  <div>
                    <div className={styles.progressInfo}>
                      <span>Completion</span>
                      <span className={styles.progressPercentage}>{progressPercentage}%</span>
                    </div>
                    <div className={styles.progressBar}>
                      <div 
                        className={styles.progressFill}
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  <div className={styles.progressText}>
                    {completedChapters} of {course?.modules?.length || 0} chapters completed
                  </div>
                </div>
              </div>
              
              <div className={styles.actionButtons}>
                <button
                  onClick={handleCreateChapter}
                  className={styles.primaryButton}
                >
                  <Plus size={20} />
                  Add New Chapter
                </button>
                
                <button className={styles.secondaryButton}>
                  <Eye size={20} />
                  Preview Course
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className={styles.tabContainer}>
        <div className={styles.tabNavigation}>
          <nav className={styles.tabList}>
            {[
              { id: 'overview', label: 'Overview', icon: BookOpen },
              { id: 'chapters', label: 'Chapters', icon: GraduationCap },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              >
                <tab.icon size={16} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'chapters' && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Course Chapters</h3>
                <p className={styles.sectionDescription}>Manage your course content structure</p>
              </div>
              <button
                onClick={handleCreateChapter}
                className={styles.addButton}
              >
                <Plus size={16} />
                Add Chapter
              </button>
            </div>
            
            {course?.modules && course.modules.length > 0 ? (
              <div className={styles.chapterList}>
                {course.modules.map((chapter: Chapter, index: number) => (
                  <div
                    key={chapter.id}
                    className={styles.chapterItem}
                  >
                    <div className={styles.chapterContent}>
                      <div 
                        className={styles.chapterLeft}
                        onClick={() => handleChapterClick(chapter.id)}
                      >
                        <div className={styles.chapterNumber}>
                          {index + 1}
                        </div>
                        <div className={styles.chapterInfo}>
                          <h4 className={styles.chapterTitle}>
                            {chapter.name[language]}
                          </h4>
                          <div className={styles.chapterMeta}>
                            <span className={styles.chapterMetaItem}>
                              {chapter.lessons?.length || 0} lessons
                            </span>
                            {chapter.finalTest && chapter.finalTest.length > 0 && (
                              <span className={styles.chapterMetaItem}>
                                <Award size={14} />
                                Final test
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className={styles.chapterActions}>
                        <div className={styles.chapterStatus}>
                          {chapter.lessons && chapter.lessons.length > 0 ? (
                            <CheckCircle2 size={20} className={styles.statusComplete} />
                          ) : (
                            <Circle size={20} className={styles.statusIncomplete} />
                          )}
                        </div>
                        
                        <div className={styles.actionGroup}>
                          <button
                            onClick={() => handleChapterClick(chapter.id)}
                            className={styles.actionButton}
                          >
                            <Edit size={16} />
                          </button>
                          
                         
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <BookOpen size={32} />
                </div>
                <h4 className={styles.emptyTitle}>No chapters yet</h4>
                <p className={styles.emptyDescription}>
                  Start building your course by creating the first chapter
                </p>
                <button
                  onClick={handleCreateChapter}
                  className={styles.emptyButton}
                >
                  <Plus size={18} />
                  Create First Chapter
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className={styles.overviewGrid}>
            <div className={styles.overviewMain}>
              <div className={styles.overviewCard}>
                <h3 className={styles.overviewCardTitle}>Course Description</h3>
                <p className={styles.overviewDescription}>
                  {course?.description[language]}
                </p>
              </div>
              
              <div className={styles.overviewCard}>
                <h3 className={styles.overviewCardTitle}>Course Information</h3>
                <div className={styles.infoList}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Course ID:</span>
                    <span className={styles.infoValue}>{course?.id}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Total Chapters:</span>
                    <span className={styles.infoValue}>{course?.modules?.length || 0}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Total Lessons:</span>
                    <span className={styles.infoValue}>{totalLessons}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Total Quizzes:</span>
                    <span className={styles.infoValue}>{totalQuizzes}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.overviewSidebar}>
              <div className={styles.overviewCard}>
                <h3 className={styles.overviewCardTitle}>Quick Actions</h3>
                <div className={styles.actionsList}>
                  <button 
                    onClick={handleCreateChapter}
                    className={styles.actionItem}
                  >
                    <Plus size={16} />
                    <span>Add Chapter</span>
                  </button>
                  <button className={styles.actionItem}>
                    <Eye size={16} />
                    <span>Preview Course</span>
                  </button>
                  <button className={styles.actionItem}>
                    <Settings size={16} />
                    <span>Edit Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className={styles.emptyState}>
            <BarChart3 size={64} className={styles.emptyStateIcon} />
            <h3 className={styles.emptyTitle}>Analytics Coming Soon</h3>
            <p className={styles.emptyDescription}>
              Detailed analytics and insights will be available here
            </p>
          </div>
        )}
      </div>

      {/* Create Chapter Modal */}
      {showCreateModal && (
        <CreateChapterModal
          courseId={Number(courseId)}              // строку в number
          onClose={handleCloseModal}               // сбросить флаг и reload
          courseName={course?.name[language] || ''} // опционально передать название
        />
      )}
    </div>
  )
}

export default CourseDetailScreen