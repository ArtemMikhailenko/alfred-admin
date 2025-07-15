import React from 'react'
import styles from './StatsOverview.module.css'

interface OverviewStats {
  totalUsers: number
  totalQuizzes: number
  totalSessions: number
  averageSessionDuration: number
  totalQuizCompletions: number
  averageQuizScore: number
  activeUsersToday: number
  quizCompletionRate: number
}

interface StatsOverviewProps {
  stats: OverviewStats
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`
  }

  const statCards = [
    {
      title: 'Total Users',
      value: formatNumber(stats.totalUsers),
      icon: '👥',
      trend: '+12%',
      trendUp: true,
      description: 'Registered users'
    },
    {
      title: 'Active Today',
      value: formatNumber(stats.activeUsersToday),
      icon: '🟢',
      trend: '+5%',
      trendUp: true,
      description: 'Users active today'
    },
    {
      title: 'Total Quizzes',
      value: formatNumber(stats.totalQuizzes),
      icon: '🎯',
      trend: '+3',
      trendUp: true,
      description: 'Published quizzes'
    },
    {
      title: 'Quiz Completions',
      value: formatNumber(stats.totalQuizCompletions),
      icon: '✅',
      trend: '+18%',
      trendUp: true,
      description: 'Completed attempts'
    },
    {
      title: 'Average Score',
      value: `${stats.averageQuizScore.toFixed(1)}/100`,
      icon: '📈',
      trend: '+2.3%',
      trendUp: true,
      description: 'Quiz performance'
    },
    {
      title: 'Completion Rate',
      value: formatPercentage(stats.quizCompletionRate),
      icon: '🎯',
      trend: '-1.2%',
      trendUp: false,
      description: 'Quiz completion ratio'
    },
    {
      title: 'Total Sessions',
      value: formatNumber(stats.totalSessions),
      icon: '📊',
      trend: '+15%',
      trendUp: true,
      description: 'User sessions'
    },
    {
      title: 'Avg Session Time',
      value: formatDuration(stats.averageSessionDuration),
      icon: '⏱️',
      trend: '+8%',
      trendUp: true,
      description: 'Time per session'
    }
  ]

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Overview Statistics</h2>
        <p className={styles.subtitle}>
          Key metrics and performance indicators for your application
        </p>
      </div>

      <div className={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <div key={index} className={styles.statCard}>
            <div className={styles.cardHeader}>
              <div className={styles.iconContainer}>
                <span className={styles.icon}>{stat.icon}</span>
              </div>
              <div className={styles.trendContainer}>
                <span className={`${styles.trend} ${stat.trendUp ? styles.trendUp : styles.trendDown}`}>
                  {stat.trendUp ? '↗' : '↘'} {stat.trend}
                </span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <div className={styles.value}>{stat.value}</div>
              <div className={styles.label}>{stat.title}</div>
              <div className={styles.description}>{stat.description}</div>
            </div>

            <div className={styles.cardFooter}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ 
                    width: `${Math.min(100, (index + 1) * 12.5)}%`,
                    backgroundColor: stat.trendUp ? 'var(--green)' : 'var(--red)'
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.insights}>
        <div className={styles.insightCard}>
          <h3 className={styles.insightTitle}>📈 Key Insights</h3>
          <ul className={styles.insightList}>
            <li className={styles.insightItem}>
              <span className={styles.insightLabel}>User Engagement:</span>
              {stats.quizCompletionRate > 70 ? 
                'Excellent completion rate indicates high user engagement' :
                'Room for improvement in quiz completion rates'
              }
            </li>
            <li className={styles.insightItem}>
              <span className={styles.insightLabel}>Performance:</span>
              {stats.averageQuizScore > 75 ? 
                'Users are performing well on quizzes' :
                'Consider reviewing quiz difficulty or providing more guidance'
              }
            </li>
            <li className={styles.insightItem}>
              <span className={styles.insightLabel}>Activity:</span>
              {stats.activeUsersToday / stats.totalUsers > 0.1 ? 
                'Strong daily active user ratio' :
                'Focus on user retention and re-engagement strategies'
              }
            </li>
          </ul>
        </div>

        <div className={styles.insightCard}>
          <h3 className={styles.insightTitle}>🎯 Recommendations</h3>
          <ul className={styles.insightList}>
            <li className={styles.insightItem}>
              Add more interactive elements to increase session duration
            </li>
            <li className={styles.insightItem}>
              Implement push notifications to boost daily active users
            </li>
            <li className={styles.insightItem}>
              Create difficulty levels to improve completion rates
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default StatsOverview