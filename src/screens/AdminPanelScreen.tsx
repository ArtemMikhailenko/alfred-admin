import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, 
  BookOpen, 
  TrendingUp, 
  UserPlus, 
  Search,
  Grid,
  List
} from 'lucide-react'
import { Course, Language } from '../constants/interfaces'
import { GetCourses } from '../actions/actions'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import LanguageSelectorBlock from '../components/LanguageSelectorBlock'
import CourseItem from '../components/course/CourseItem'
import CreateCourseModal from '../components/course/CreateCourseModal'
import CreateAdminModal from '../components/admin/CreateAdminModal'
import Button from '../components/Button'
import Input from '../components/Input'
import toast from 'react-hot-toast'
import styles from './AdminPanelScreen.module.css'

const AdminPanelScreen = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tokens = useSelector((state: RootState) => state.tokens)
  
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [modal, setModal] = useState<'course' | 'admin' | null>(null)
  const [language, setLanguage] = useState<Language>('ua')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isLoading, setIsLoading] = useState(true)

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
    const filtered = courses.filter(course =>
      course.name[language]?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description[language]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredCourses(filtered)
  }, [searchTerm, courses, language])

  const handleCreateCourse = () => {
    setModal('course')
  }

  const handleCreateAdmin = () => {
    setModal('admin')
  }

  const handleOpenCourse = (course: Course) => {
    navigate(`/course/${course.id}`)
  }

  const handleOpenSwipeTrade = () => {
    navigate('/swipetrade')
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

  const stats = [
    {
      title: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      colorClass: styles.textBlue400,
      bgClass: styles.bgBlue400
    },
    {
      title: 'Active Courses',
      value: courses.length,
      icon: TrendingUp,
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
    <div className={styles.adminPanelContent}>
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={`${styles.statIcon} ${stat.bgClass}`}>
              <stat.icon className={`${styles.statIconSvg} ${stat.colorClass}`} />
            </div>
            <div className={styles.statContent}>
              <p className={styles.statTitle}>{stat.title}</p>
              <p className={styles.statValue}>{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Bar */}
      <div className={styles.actionsBar}>
        <div className={styles.actionsLeft}>
          <Button onClick={handleCreateCourse} size="md">
            <Plus size={18} />
            Create Course
          </Button>
          <Button variant="secondary" onClick={handleOpenSwipeTrade} size="md">
            <TrendingUp size={18} />
            Swipe Trade
          </Button>
          <Button variant="secondary" onClick={handleCreateAdmin} size="md">
            <UserPlus size={18} />
            Add Admin
          </Button>
        </div>
        
        <div className={styles.actionsRight}>
          <Input
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={Search}
            className={styles.searchInput}
          />
          <LanguageSelectorBlock language={language} setLanguage={setLanguage} />
          <div className={styles.viewToggle}>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid size={16} />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Section */}
      <div className={styles.coursesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Courses</h2>
          <span className={styles.sectionCount}>{filteredCourses.length} courses</span>
        </div>
        
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.loadingSpinnerLarge} />
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
            <BookOpen size={48} className={styles.emptyIcon} />
            <h3>No courses found</h3>
            <p>
              {searchTerm 
                ? `No courses match "${searchTerm}"`
                : 'Start by creating your first course'
              }
            </p>
            {!searchTerm && (
              <Button onClick={handleCreateCourse} className={styles.mt4}>
                <Plus size={18} />
                Create First Course
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {modal === 'course' && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <CreateCourseModal onClose={handleModalClose} />
          </div>
        </div>
      )}
      
      {modal === 'admin' && (
        <div className={styles.modalOverlay}>
          <CreateAdminModal onClose={handleModalClose} />
        </div>
      )}
    </div>
  )
}

export default AdminPanelScreen