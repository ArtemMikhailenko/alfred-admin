import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Plus,
  BookOpen,
  GraduationCap,
  Award,
  Play,
  Edit,
  Trash2,
  Clock,
  Users,
  Target,
  CheckCircle2,
  Circle,
  BarChart3,
  Settings,
  Eye,
  FileText,
  Zap
} from 'lucide-react'
import {
  Chapter,
  Course,
  FinalTest,
  Language,
  languagesObjString,
  LessonWithLanguages,
  Quiz,
} from '../constants/interfaces'
import FinalTestCreator from '../components/finalTest/FinalTestCreator'
import {
  DeleteLesson,
  GetAllLessonsInChapter,
  GetCourseById,
} from '../actions/actions'
import CreateLessonModal from '../components/CreateLessonModal'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import LanguageSelectorBlock from '../components/LanguageSelectorBlock'
import toast from 'react-hot-toast'
import styles from './ChapterScreen.module.css'

const ChapterScreen: React.FC = () => {
  const tokens = useSelector((state: RootState) => state.tokens)
  const navigate = useNavigate()
  const { courseId, chapterId } = useParams()

  const [course, setCourse] = useState<Course>()
  const [chapter, setChapter] = useState<Chapter>()
  const [language, setLanguage] = useState<Language>('ua')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [modal, setModal] = useState<'lesson' | 'finalTest' | null>(null)
  const [currentLesson, setCurrentLesson] = useState<LessonWithLanguages | null>(null)
  const [currentFinalTest, setCurrentFinalTest] = useState<FinalTest | null>(null)
  const [activeTab, setActiveTab] = useState<'lessons' | 'finalTest' | 'analytics'>('lessons')

  const loadChapterData = async () => {
    if (!courseId || !chapterId) return

    setIsLoading(true)
    setError(null)

    try {
      const [responseCourse, responseChapter] = await Promise.all([
        GetCourseById(courseId),
        GetAllLessonsInChapter(chapterId)
      ])

      if (responseCourse.error) {
        throw new Error(responseCourse.error)
      }

      setCourse(responseCourse)
      setChapter(responseChapter)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load chapter data'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadChapterData()
  }, [courseId, chapterId])

  const handleCreateLesson = () => {
    if (chapterId) {
      setCurrentLesson({
        moduleId: chapterId,
        name: languagesObjString,
        text: languagesObjString,
        number: (chapter?.lessons?.length ?? 0) + 1,
        comment: languagesObjString,
        banner: '',
        avatar: '',
        motivation: languagesObjString,
        quiz: [],
      })
      setModal('lesson')
    } else {
      toast.error('Chapter ID error, try again')
    }
  }

  const handleEditLesson = (lesson: LessonWithLanguages) => {
    setCurrentLesson(lesson)
    setModal('lesson')
  }

  const handleDeleteLesson = async (lesson: LessonWithLanguages) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${lesson.name[language]}"?\n\nThis action cannot be undone.`
    )
    
    if (confirmDelete && lesson.id && tokens.accessToken) {
      try {
        await DeleteLesson(lesson.id, tokens.accessToken)
        toast.success('Lesson deleted successfully')
        loadChapterData()
      } catch (error) {
        toast.error('Failed to delete lesson')
      }
    }
  }

  const handleCreateFinalTest = () => {
    setCurrentFinalTest(chapter?.finalTest || [])
    setModal('finalTest')
  }

  const handleModalClose = (isUpdated: boolean) => {
    if (isUpdated) {
      const confirmClose = window.confirm(
        'You may have unsaved changes. Are you sure you want to close without saving?'
      )
      if (confirmClose) {
        setModal(null)
      }
    } else {
      setModal(null)
      loadChapterData()
    }
  }

  const handleBackToCourse = () => {
    navigate(`/course/${courseId}`)
  }

  const handleBackToCourses = () => {
    navigate('/courses')
  }

  // Вычисления для статистики
  const totalLessons = chapter?.lessons?.length || 0
  const completedLessons = 0 // Здесь можно добавить логику подсчета завершенных уроков
  const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  const hasFinalTest = chapter?.finalTest && chapter.finalTest.length > 0
  const estimatedDuration = totalLessons * 15 // 15 минут на урок

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Loading chapter...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h3 className={styles.errorTitle}>Error Loading Chapter</h3>
          <p className={styles.errorText}>{error}</p>
          <div className={styles.errorActions}>
            <button onClick={loadChapterData} className={styles.retryButton}>
              Try Again
            </button>
            <button onClick={handleBackToCourse} className={styles.backButton}>
              <ArrowLeft size={16} />
              Back to Course
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      {/* <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button onClick={handleBackToCourse} className={styles.backButton}>
              <ArrowLeft size={20} />
              <span>Back to Course</span>
            </button>
            <div className={styles.headerDivider} />
            <div className={styles.breadcrumb}>
              <button onClick={handleBackToCourses} className={styles.breadcrumbItem}>
                Courses
              </button>
              <span className={styles.breadcrumbSeparator}>/</span>
              <button onClick={handleBackToCourse} className={styles.breadcrumbItem}>
                {course?.name[language]}
              </button>
              <span className={styles.breadcrumbSeparator}>/</span>
              <span className={styles.breadcrumbCurrent}>
                {chapter?.name[language] || 'Chapter'}
              </span>
            </div>
          </div>
          
          <div className={styles.headerRight}>
            <LanguageSelectorBlock language={language} setLanguage={setLanguage} />
            <button className={styles.settingsButton}>
              <Settings size={18} />
            </button>
          </div>
        </div>
      </div> */}

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.heroBackground} />
        <div className={styles.heroContent}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <div className={styles.heroHeader}>
                <div className={styles.heroIcon}>
                  <BookOpen size={28} />
                </div>
                <div>
                  <h1 className={styles.heroTitle}>
                    {chapter?.name[language] || 'Chapter'}
                  </h1>
                  <p className={styles.heroSubtitle}>
                    Chapter {chapterId} • {course?.name[language]}
                  </p>
                </div>
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statBlue}`}>
                    <GraduationCap size={18} />
                    <span>Lessons</span>
                  </div>
                  <div className={`${styles.statValue} ${styles.statBlue}`}>
                    {totalLessons}
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statGreen}`}>
                    <CheckCircle2 size={18} />
                    <span>Completed</span>
                  </div>
                  <div className={`${styles.statValue} ${styles.statGreen}`}>
                    {completedLessons}
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statPurple}`}>
                    <Award size={18} />
                    <span>Final Test</span>
                  </div>
                  <div className={`${styles.statValue} ${styles.statPurple}`}>
                    {hasFinalTest ? '✓' : '✗'}
                  </div>
                </div>

                <div className={styles.statCard}>
                  <div className={`${styles.statHeader} ${styles.statOrange}`}>
                    <Clock size={18} />
                    <span>Duration</span>
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
                  <Target size={20} />
                  Chapter Progress
                </h3>
                <div className={styles.progressContent}>
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
                  <div className={styles.progressText}>
                    {completedLessons} of {totalLessons} lessons completed
                  </div>
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button onClick={handleCreateLesson} className={styles.primaryButton}>
                  <Plus size={20} />
                  Add Lesson
                </button>
                <button onClick={handleCreateFinalTest} className={styles.secondaryButton}>
                  <Award size={20} />
                  {hasFinalTest ? 'Edit' : 'Create'} Final Test
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
              { id: 'lessons', label: 'Lessons', icon: GraduationCap, count: totalLessons },
              { id: 'finalTest', label: 'Final Test', icon: Award, count: chapter?.finalTest?.length || 0 },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
              >
                <tab.icon size={16} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className={styles.tabBadge}>{tab.count}</span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className={styles.tabContent}>
        {activeTab === 'lessons' && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Chapter Lessons</h3>
                <p className={styles.sectionDescription}>
                  Manage and organize your lesson content
                </p>
              </div>
              <button onClick={handleCreateLesson} className={styles.addButton}>
                <Plus size={16} />
                Add Lesson
              </button>
            </div>

            {chapter?.lessons && chapter.lessons.length > 0 ? (
              <div className={styles.lessonsList}>
                {chapter.lessons.map((lesson: LessonWithLanguages, index: number) => (
                  <div key={lesson.id} className={styles.lessonCard}>
                    <div className={styles.lessonContent}>
                      <div className={styles.lessonLeft}>
                        <div className={styles.lessonNumber}>
                          {lesson.number || index + 1}
                        </div>
                        <div className={styles.lessonInfo}>
                          <h4 className={styles.lessonTitle}>
                            {lesson.name[language]}
                          </h4>
                          <p className={styles.lessonComment}>
                            {lesson.comment[language]}
                          </p>
                          <div className={styles.lessonMeta}>
                            <span className={styles.metaItem}>
                              <FileText size={14} />
                              Text content
                            </span>
                            {lesson.quiz && lesson.quiz.length > 0 && (
                              <span className={styles.metaItem}>
                                <Zap size={14} />
                                {lesson.quiz.length} quiz{lesson.quiz.length !== 1 ? 'zes' : ''}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.lessonActions}>
                        <button
                          onClick={() => handleEditLesson(lesson)}
                          className={styles.actionButton}
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteLesson(lesson)}
                          className={`${styles.actionButton} ${styles.danger}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <GraduationCap size={48} />
                </div>
                <h4 className={styles.emptyTitle}>No lessons yet</h4>
                <p className={styles.emptyDescription}>
                  Start building your chapter by creating the first lesson
                </p>
                <button onClick={handleCreateLesson} className={styles.emptyButton}>
                  <Plus size={18} />
                  Create First Lesson
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'finalTest' && (
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <div>
                <h3 className={styles.sectionTitle}>Final Test</h3>
                <p className={styles.sectionDescription}>
                  Test student knowledge at the end of this chapter
                </p>
              </div>
              <button onClick={handleCreateFinalTest} className={styles.addButton}>
                <Award size={16} />
                {hasFinalTest ? 'Edit Test' : 'Create Test'}
              </button>
            </div>

            {chapter?.finalTest && chapter.finalTest.length > 0 ? (
              <div className={styles.testList}>
                {chapter.finalTest.map((quiz: Quiz, index: number) => (
                  <div key={index} className={styles.testCard}>
                    <div className={styles.testContent}>
                      <div className={styles.testNumber}>
                        {index + 1}
                      </div>
                      <div className={styles.testInfo}>
                        <h4 className={styles.testQuestion}>
                          {quiz.question[language]}
                        </h4>
                        <div className={styles.testMeta}>
                          <span className={styles.metaItem}>
                            {quiz.options[language]?.length || 0} options
                          </span>
                          <span className={styles.metaItem}>
                            {quiz.correctAnswer[language]?.length || 0} correct
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>
                  <Award size={48} />
                </div>
                <h4 className={styles.emptyTitle}>No final test yet</h4>
                <p className={styles.emptyDescription}>
                  Create a final test to assess student learning outcomes
                </p>
                <button onClick={handleCreateFinalTest} className={styles.emptyButton}>
                  <Award size={18} />
                  Create Final Test
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className={styles.emptyState}>
            <BarChart3 size={64} className={styles.emptyStateIcon} />
            <h3 className={styles.emptyTitle}>Analytics Coming Soon</h3>
            <p className={styles.emptyDescription}>
              Detailed analytics and student progress will be available here
            </p>
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === 'lesson' && currentLesson && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <CreateLessonModal
              initialLessonValue={currentLesson}
              onClose={handleModalClose}
            />
          </div>
        </div>
      )}

      {modal === 'finalTest' && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <FinalTestCreator
              chapter={chapter}
              initialQuiz={currentFinalTest || []}
              onClose={handleModalClose}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default ChapterScreen