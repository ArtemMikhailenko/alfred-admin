import React from 'react'
import styles from './MobileAppsOverview.module.css'
import { MobileAppAnalytics } from '../../mobileAnalyticsService'

interface MobileAppsOverviewProps {
  apps: MobileAppAnalytics[]
  loading?: boolean
}

const MobileAppsOverview: React.FC<MobileAppsOverviewProps> = ({ apps, loading }) => {
  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatPercentage = (num: number): string => {
    return `${num.toFixed(1)}%`
  }

  const getPlatformIcon = (platform: string) => {
    return platform === 'android' ? '🤖' : '📱'
  }

  const getPlatformColor = (platform: string) => {
    return platform === 'android' ? 'var(--green)' : 'var(--blue)'
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Mobile Applications</h2>
          <p className={styles.subtitle}>Loading mobile apps analytics...</p>
        </div>
        <div className={styles.loadingGrid}>
          {[1, 2].map(i => (
            <div key={i} className={styles.loadingCard}>
              <div className={styles.loadingSkeleton}></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalUsers = apps.reduce((sum, app) => sum + app.totalUsers, 0)
  const totalSessions = apps.reduce((sum, app) => sum + app.sessionCount, 0)
  const averageCrashFreeRate = apps.length > 0 
    ? apps.reduce((sum, app) => sum + app.crashFreeRate, 0) / apps.length 
    : 100

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Mobile Applications</h2>
        <p className={styles.subtitle}>
          Analytics for Android and iOS applications
        </p>
      </div>

      {/* Summary Stats */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>📊</div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryValue}>{formatNumber(totalUsers)}</div>
            <div className={styles.summaryLabel}>Total Mobile Users</div>
          </div>
        </div>
        
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>🎯</div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryValue}>{formatNumber(totalSessions)}</div>
            <div className={styles.summaryLabel}>Total Sessions</div>
          </div>
        </div>
        
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>⚡</div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryValue}>{formatPercentage(averageCrashFreeRate)}</div>
            <div className={styles.summaryLabel}>Crash-Free Rate</div>
          </div>
        </div>
      </div>

      {/* Individual App Cards */}
      <div className={styles.appsGrid}>
        {apps.map((app) => (
          <div key={app.appId} className={styles.appCard}>
            <div className={styles.appHeader}>
              <div className={styles.appIconContainer}>
                <span 
                  className={styles.appIcon}
                  style={{ color: getPlatformColor(app.platform) }}
                >
                  {getPlatformIcon(app.platform)}
                </span>
              </div>
              
              <div className={styles.appInfo}>
                <h3 className={styles.appName}>{app.appName}</h3>
                <p className={styles.appPlatform}>
                  {app.platform.toUpperCase()} • v{app.appVersion}
                </p>
              </div>
              
              <div className={styles.appStatus}>
                <div 
                  className={styles.statusDot}
                  style={{ backgroundColor: app.crashFreeRate > 95 ? 'var(--green)' : 'var(--yellow)' }}
                />
              </div>
            </div>

            <div className={styles.appStats}>
              <div className={styles.statRow}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{formatNumber(app.totalUsers)}</span>
                  <span className={styles.statLabel}>Total Users</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{formatNumber(app.dailyActiveUsers)}</span>
                  <span className={styles.statLabel}>Daily Active</span>
                </div>
              </div>

              <div className={styles.statRow}>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{formatNumber(app.sessionCount)}</span>
                  <span className={styles.statLabel}>Sessions</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>{formatDuration(app.averageSessionDuration)}</span>
                  <span className={styles.statLabel}>Avg Session</span>
                </div>
              </div>

              <div className={styles.statRow}>
                <div className={styles.statItem}>
                  <span 
                    className={styles.statValue}
                    style={{ 
                      color: app.crashFreeRate > 95 ? 'var(--green)' : 
                             app.crashFreeRate > 90 ? 'var(--yellow)' : 'var(--red)'
                    }}
                  >
                    {formatPercentage(app.crashFreeRate)}
                  </span>
                  <span className={styles.statLabel}>Crash-Free</span>
                </div>
                <div className={styles.statItem}>
                  <span className={styles.statValue}>
                    {app.lastUpdate.toLocaleDateString()}
                  </span>
                  <span className={styles.statLabel}>Last Update</span>
                </div>
              </div>
            </div>

            <div className={styles.appFooter}>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ 
                    width: `${app.crashFreeRate}%`,
                    backgroundColor: app.crashFreeRate > 95 ? 'var(--green)' : 
                                   app.crashFreeRate > 90 ? 'var(--yellow)' : 'var(--red)'
                  }}
                />
              </div>
              <div className={styles.appActions}>
                <button className={styles.actionButton}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path 
                      d="M8 3V13M13 8H3" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                    />
                  </svg>
                  Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {apps.length === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📱</div>
          <h3 className={styles.emptyTitle}>No Mobile Data</h3>
          <p className={styles.emptyDescription}>
            Mobile analytics data will appear here once your apps start sending data to Firebase.
          </p>
        </div>
      )}
    </div>
  )
}

export default MobileAppsOverview