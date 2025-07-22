import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  BookOpen, 
  TrendingUp, 
  Users, 
  Star,
  Activity,
  Clock,
  Calendar,
  ArrowUpRight,
  BarChart3,
  PieChart,
  Zap
} from 'lucide-react'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'
import { GetCourses } from '../actions/actions'
import Button from '../components/Button'
import toast from 'react-hot-toast'
import styles from './DashboardScreen.module.css'

const DashboardScreen = () => {
  const navigate = useNavigate()
  const tokens = useSelector((state: RootState) => state.tokens)
  
  const [courses, setCourses] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const getCourses = async () => {
    try {
      setIsLoading(true)
      const response = await GetCourses()
      setCourses(response)
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getCourses()
  }, [])

  const stats = [
    {
      title: 'Total Courses',
      value: courses.length,
      icon: BookOpen,
      colorClass: styles.textBlue400,
      bgClass: styles.bgBlue400,
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Active Users',
      value: '2,847',
      icon: Users,
      colorClass: styles.textGreen400,
      bgClass: styles.bgGreen400,
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Course Completions',
      value: '1,234',
      icon: Star,
      colorClass: styles.textYellow400,
      bgClass: styles.bgYellow400,
      change: '+23%',
      changeType: 'positive'
    },
    {
      title: 'Total Revenue',
      value: '$45,678',
      icon: TrendingUp,
      colorClass: styles.textPurple400,
      bgClass: styles.bgPurple400,
      change: '+15%',
      changeType: 'positive'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'course_completed',
      user: 'John Doe',
      course: 'Advanced Trading Strategies',
      time: '2 hours ago',
      icon: Star
    },
    {
      id: 2,
      type: 'new_user',
      user: 'Alice Smith',
      course: 'Just registered',
      time: '4 hours ago',
      icon: Users
    },
    {
      id: 3,
      type: 'quiz_completed',
      user: 'Bob Johnson',
      course: 'Forex Basics Quiz',
      time: '6 hours ago',
      icon: Zap
    },
    {
      id: 4,
      type: 'course_started',
      user: 'Emma Wilson',
      course: 'Cryptocurrency Trading',
      time: '8 hours ago',
      icon: BookOpen
    }
  ]

  const quickActions = [
    {
      title: 'Manage Courses',
      description: 'View and edit all courses',
      icon: BookOpen,
      action: () => navigate('/courses'),
      color: 'blue'
    },
    {
      title: 'Swipe Trade',
      description: 'Trading quizzes and charts',
      icon: TrendingUp,
      action: () => navigate('/swipetrade'),
      color: 'green'
    },
    {
      title: 'User Management',
      description: 'View and manage users',
      icon: Users,
      action: () => {},
      color: 'purple'
    },
    {
      title: 'Analytics',
      description: 'View detailed reports',
      icon: BarChart3,
      action: () => {},
      color: 'yellow'
    }
  ]

  return (
    <div className={styles.dashboardContent}>
      {/* Welcome Section */}
      <div className={styles.welcomeSection}>
        <div className={styles.welcomeText}>
          <h1 className={styles.welcomeTitle}>Welcome back, Admin! 👋</h1>
          <p className={styles.welcomeSubtitle}>
            Here's what's happening with your trading platform today.
          </p>
        </div>
        <div className={styles.welcomeDate}>
          <Calendar size={20} />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      {/* <div className={styles.statsGrid}>
        {stats.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={`${styles.statIcon} ${stat.bgClass}`}>
                <stat.icon className={`${styles.statIconSvg} ${stat.colorClass}`} />
              </div>
              <div className={`${styles.statChange} ${styles[stat.changeType]}`}>
                <ArrowUpRight size={16} />
                <span>{stat.change}</span>
              </div>
            </div>
            <div className={styles.statContent}>
              <p className={styles.statValue}>{stat.value}</p>
              <p className={styles.statTitle}>{stat.title}</p>
            </div>
          </div>
        ))}
      </div> */}

     
      {/* <div className={styles.mainGrid}>
        
        <div className={styles.quickActionsCard}>
          <h3 className={styles.cardTitle}>Quick Actions</h3>
          <div className={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <button
                key={index}
                onClick={action.action}
                className={`${styles.quickActionItem} ${styles[`color${action.color}`]}`}
              >
                <action.icon size={24} />
                <div className={styles.quickActionContent}>
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
                <ArrowUpRight size={16} className={styles.quickActionArrow} />
              </button>
            ))}
          </div>
        </div>

     
        <div className={styles.activityCard}>
          <div className={styles.cardHeader}>
            <h3 className={styles.cardTitle}>Recent Activity</h3>
            <Activity size={20} className={styles.cardIcon} />
          </div>
          <div className={styles.activityList}>
            {recentActivities.map((activity) => (
              <div key={activity.id} className={styles.activityItem}>
                <div className={styles.activityIcon}>
                  <activity.icon size={16} />
                </div>
                <div className={styles.activityContent}>
                  <p className={styles.activityText}>
                    <strong>{activity.user}</strong> {activity.course}
                  </p>
                  <div className={styles.activityTime}>
                    <Clock size={12} />
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      
        <div className={styles.overviewCard}>
          <h3 className={styles.cardTitle}>Platform Overview</h3>
          <div className={styles.overviewStats}>
            <div className={styles.overviewItem}>
              <PieChart size={20} className={styles.overviewIcon} />
              <div>
                <p className={styles.overviewValue}>89%</p>
                <p className={styles.overviewLabel}>Course Completion Rate</p>
              </div>
            </div>
            <div className={styles.overviewItem}>
              <BarChart3 size={20} className={styles.overviewIcon} />
              <div>
                <p className={styles.overviewValue}>4.8/5</p>
                <p className={styles.overviewLabel}>Average Course Rating</p>
              </div>
            </div>
            <div className={styles.overviewItem}>
              <TrendingUp size={20} className={styles.overviewIcon} />
              <div>
                <p className={styles.overviewValue}>156</p>
                <p className={styles.overviewLabel}>New Users This Week</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      {/* System Status */}
      {/* <div className={styles.systemStatus}>
        <h3 className={styles.cardTitle}>System Status</h3>
        <div className={styles.statusGrid}>
          <div className={styles.statusItem}>
            <div className={`${styles.statusIndicator} ${styles.statusOnline}`}></div>
            <span>API Server</span>
            <span className={styles.statusValue}>Online</span>
          </div>
          <div className={styles.statusItem}>
            <div className={`${styles.statusIndicator} ${styles.statusOnline}`}></div>
            <span>Database</span>
            <span className={styles.statusValue}>Online</span>
          </div>
          <div className={styles.statusItem}>
            <div className={`${styles.statusIndicator} ${styles.statusWarning}`}></div>
            <span>CDN</span>
            <span className={styles.statusValue}>Slow</span>
          </div>
          <div className={styles.statusItem}>
            <div className={`${styles.statusIndicator} ${styles.statusOnline}`}></div>
            <span>Payment Gateway</span>
            <span className={styles.statusValue}>Online</span>
          </div>
        </div>
      </div> */}
    </div>
  )
}

export default DashboardScreen