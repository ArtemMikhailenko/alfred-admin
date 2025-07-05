import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  BookOpen, 
  Search,
  Grid,
  List,
  Filter,
  SortDesc
} from 'lucide-react'
import { Course, Language, Chapter, LessonWithLanguages } from '../constants/interfaces'
import { GetCourses } from '../actions/actions'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import LanguageSelectorBlock from '../components/LanguageSelectorBlock'
import CourseItem from '../components/course/CourseItem'
import CreateCourseModal from '../components/course/CreateCourseModal'
import toast from 'react-hot-toast'
import styles from './CoursesScreen.module.css'

interface CoursesScreenProps {
  onCreateCourse?: () => void
  searchTerm?: string
  onSearchChange?: (value: string) => void
  language?: Language
  onLanguageChange?: (lang: Language) => void
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
}

const CoursesScreen: React.FC<CoursesScreenProps> = ({
  searchTerm = '',
  onSearchChange,
  language = 'ua',
  onLanguageChange,
  viewMode = 'grid',
  onViewModeChange
}) => {
  const navigate = useNavigate()
  const tokens = useSelector((state: RootState) => state.tokens)
  
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [modal, setModal] = useState<'course' | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'chapters'>('name')
  const [filterBy, setFilterBy] = useState<'all' | 'active' | 'draft'>('all')

  const getCourses = async () => {
    try {
      setIsLoading(true)
      const response = await GetCourses()
      setCourses(response)
      setFilteredCourses(response)
    } catch (error) {
      toast.error('Failed to fetch courses')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (modal === null) {
      getCourses()
    }
  }, [modal])

  useEffect(() => {
    let filtered = courses.filter(course =>
      course.name[language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description[language]?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Apply filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(course => {
        const hasContent = course.modules && course.modules.length > 0
        const hasLessons = course.modules?.some((module: Chapter) => 
          module.lessons && module.lessons.length > 0
        )
        
        switch (filterBy) {
          case 'active':
            return hasContent && hasLessons
          case 'draft':
            return !hasContent || !hasLessons
          default:
            return true
        }
      })
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name[language] || '').localeCompare(b.name[language] || '')
        case 'chapters':
          return (b.modules?.length || 0) - (a.modules?.length || 0)
        case 'date':
          return b.id - a.id // Assuming higher ID means newer
        default:
          return 0
      }
    })

    setFilteredCourses(filtered)
  }, [searchTerm, courses, language, sortBy, filterBy])

  const handleOpenCourse = (course: Course) => {
    navigate(`/course/${course.id}`)
  }

  const handleModalClose = (isUpdated: boolean) => {
    if (isUpdated) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      )
      if (confirmClose) {
        setModal(null)
      }
    } else {
      setModal(null)
    }
  }

  const handleCreateCourse = () => {
    setModal('course')
  }

  const stats = [
    {
      title: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      colorClass: styles.textBlue400,
      bgClass: styles.bgBlue400
    },
    {
      title: 'Published',
      value: courses.filter(course => 
        course.modules && course.modules.length > 0 && 
        course.modules.some((m: Chapter) => m.lessons && m.lessons.length > 0)
      ).length,
      icon: BookOpen,
      colorClass: styles.textGreen400,
      bgClass: styles.bgGreen400
    },
    {
      title: 'Total Chapters',
      value: courses.reduce((acc, course) => acc + (course.modules?.length || 0), 0),
      icon: BookOpen,
      colorClass: styles.textPurple400,
      bgClass: styles.bgPurple400
    }
  ]

  return (
    <div className={styles.coursesContent}>
      {/* Header Section */}
      <div className={styles.headerSection}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>Course Management</h1>
          <p className={styles.pageSubtitle}>
            Create, edit, and manage your trading courses
          </p>
        </div>
        <button onClick={handleCreateCourse} className={styles.primaryButton}>
          <Plus size={20} />
          Create New Course
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={`${styles.statIcon} ${stat.bgClass}`}>
              <stat.icon className={`${styles.statIconSvg} ${stat.colorClass}`} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statTitle}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters and Controls */}
      <div className={styles.controlsSection}>
        <div className={styles.controlsLeft}>
          <div className={styles.filterGroup}>
            <Filter size={16} />
            <select 
              value={filterBy} 
              onChange={(e) => setFilterBy(e.target.value as any)}
              className={styles.select}
            >
              <option value="all">All Courses</option>
              <option value="active">Active</option>
              <option value="draft">Draft</option>
            </select>
          </div>
          
          <div className={styles.sortGroup}>
            <SortDesc size={16} />
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className={styles.select}
            >
              <option value="name">Sort by Name</option>
              <option value="date">Sort by Date</option>
              <option value="chapters">Sort by Chapters</option>
            </select>
          </div>
        </div>

        <div className={styles.controlsRight}>
          <div className={styles.searchContainer}>
            <Search size={16} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className={styles.searchInput}
            />
          </div>
          
          <LanguageSelectorBlock 
            language={language} 
            setLanguage={onLanguageChange || (() => {})} 
          />
        </div>
      </div>

      {/* Courses Section */}
      <div className={styles.coursesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>All Courses</h2>
          <div className={styles.sectionControls}>
            <span className={styles.sectionCount}>{filteredCourses.length} courses</span>
            <div className={styles.viewToggle}>
              <button 
                className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
                onClick={() => onViewModeChange?.('grid')}
              >
                <Grid size={16} />
              </button>
              <button 
                className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
                onClick={() => onViewModeChange?.('list')}
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinner} />
            <p>Loading courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className={`${styles.coursesGrid} ${viewMode === 'list' ? styles.coursesList : ''}`}>
            {filteredCourses.map((course) => (
              <CourseItem
                key={course.id}
                course={course}
                openCourse={handleOpenCourse}
                language={language}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <BookOpen size={64} className={styles.emptyIcon} />
            <h3>No courses found</h3>
            <p>
              {searchTerm 
                ? `No courses match "${searchTerm}"`
                : 'Start by creating your first course'
              }
            </p>
            <button onClick={handleCreateCourse} className={styles.createButton}>
              <Plus size={18} />
              Create First Course
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {modal === 'course' && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <CreateCourseModal onClose={handleModalClose} />
          </div>
        </div>
      )}
    </div>
  )
}

export default CoursesScreen