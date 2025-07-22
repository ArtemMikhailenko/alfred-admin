import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { firebaseAnalyticsService, FirebaseAnalyticsResponse } from '../../services/firebaseAnalyticsService'
import { RootState } from '../../redux'
import colors from '../../constants/colors'

// Components
import AnalyticsHeader from './AnalyticsHeader'
import FirebaseStatsOverview from './FirebaseStatsOverview'
import EventsChart from './EventsChart'
// import ScreenViewsChart from './ScreenViewsChart'
import UserEngagementMetrics from './UserEngagementMetrics'


type TimeRange = '7d' | '30d' | '90d' | '1y'
type AnalyticsTab = 'overview' | 'events' | 'users' | 'engagement'

const AnalyticsScreen: React.FC = () => {
  const tokens = useSelector((state: RootState) => state.tokens)
  
  // State
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [analyticsData, setAnalyticsData] = useState<FirebaseAnalyticsResponse | null>(null)

  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange, tokens.accessToken])

  const loadAnalyticsData = async () => {
    if (!tokens.accessToken) {
      setError('No access token available')
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { startDate, endDate } = firebaseAnalyticsService.formatTimeRange(timeRange)
      const data = await firebaseAnalyticsService.getAnalytics(startDate, endDate, tokens.accessToken)
      setAnalyticsData(data)
    } catch (err) {
      console.error('Error loading analytics data:', err)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const handleExportData = async () => {
    if (!analyticsData) return

    try {
      const exportData = {
        ...analyticsData,
        exportDate: new Date().toISOString(),
        timeRange
      }

      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = `alfred-trade-analytics-${timeRange}-${new Date().toISOString().split('T')[0]}.json`
      link.click()
      
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Error exporting data:', err)
    }
  }

  if (loading && !analyticsData) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner} />
          <p style={styles.loadingText}>Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>⚠️</div>
          <h2 style={styles.errorTitle}>Error Loading Analytics</h2>
          <p style={styles.errorMessage}>{error}</p>
          <button style={styles.retryButton} onClick={loadAnalyticsData}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <div style={styles.errorIcon}>📊</div>
          <h2 style={styles.errorTitle}>No Data Available</h2>
          <p style={styles.errorMessage}>No analytics data found for the selected time range.</p>
          <button style={styles.retryButton} onClick={loadAnalyticsData}>
            Refresh
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <AnalyticsHeader
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={handleExportData}
      />

      <div style={styles.content}>
        {activeTab === 'overview' && (
          <div style={styles.overviewTab}>
            <FirebaseStatsOverview data={analyticsData} />
            
            <div style={styles.chartsGrid}>
              <div style={styles.chartCard}>
                <EventsChart 
                  events={analyticsData.events} 
                  timeRange={timeRange}
                />
              </div>
              
              {/* <div style={styles.chartCard}>
                <ScreenViewsChart 
                  screens={analyticsData.topScreens} 
                  timeRange={timeRange}
                />
              </div> */}
            </div>

            <div style={styles.metricsCard}>
              <UserEngagementMetrics 
                overview={analyticsData.overview}
                events={analyticsData.events}
              />
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div style={styles.eventsTab}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Event Analytics</h2>
              <p style={styles.sectionSubtitle}>
                Detailed breakdown of user events and interactions
              </p>
            </div>

            <EventsChart 
              events={analyticsData.events} 
              timeRange={timeRange}
              detailed={true}
            />
          </div>
        )}

        {/* {activeTab === 'screens' && (
          <div style={styles.screensTab}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>Screen Analytics</h2>
              <p style={styles.sectionSubtitle}>
                Most viewed screens and user navigation patterns
              </p>
            </div>

            <ScreenViewsChart 
              screens={analyticsData.topScreens} 
              timeRange={timeRange}
              detailed={true}
            />
          </div>
        )} */}

        {activeTab === 'users' && (
          <div style={styles.usersTab}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>User Analytics</h2>
              <p style={styles.sectionSubtitle}>
                User acquisition, retention, and behavior insights
              </p>
            </div>

            <div style={styles.userMetricsGrid}>
              <div style={styles.userMetricCard}>
                <h3 style={styles.metricTitle}>User Acquisition</h3>
                <div style={styles.metricValue}>{analyticsData.overview.newUsers}</div>
                <div style={styles.metricLabel}>New Users</div>
                <div style={styles.metricProgress}>
                  <div 
                    style={{
                      ...styles.metricProgressFill,
                      width: `${(analyticsData.overview.newUsers / analyticsData.overview.totalUsers) * 100}%`,
                      backgroundColor: colors.green
                    }}
                  />
                </div>
              </div>

              <div style={styles.userMetricCard}>
                <h3 style={styles.metricTitle}>User Retention</h3>
                <div style={styles.metricValue}>{(100 - analyticsData.overview.bounceRate * 100).toFixed(1)}%</div>
                <div style={styles.metricLabel}>Retention Rate</div>
                <div style={styles.metricProgress}>
                  <div 
                    style={{
                      ...styles.metricProgressFill,
                      width: `${100 - analyticsData.overview.bounceRate * 100}%`,
                      backgroundColor: colors.blue
                    }}
                  />
                </div>
              </div>

              <div style={styles.userMetricCard}>
                <h3 style={styles.metricTitle}>Active Users</h3>
                <div style={styles.metricValue}>{analyticsData.overview.activeUsers}</div>
                <div style={styles.metricLabel}>Currently Active</div>
                <div style={styles.metricProgress}>
                  <div 
                    style={{
                      ...styles.metricProgressFill,
                      width: `${(analyticsData.overview.activeUsers / analyticsData.overview.totalUsers) * 100}%`,
                      backgroundColor: colors.yellow
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'engagement' && (
          <div style={styles.engagementTab}>
            <div style={styles.sectionHeader}>
              <h2 style={styles.sectionTitle}>User Engagement</h2>
              <p style={styles.sectionSubtitle}>
                Session duration, bounce rate, and engagement metrics
              </p>
            </div>

            <UserEngagementMetrics 
              overview={analyticsData.overview}
              events={analyticsData.events}
              detailed={true}
            />
          </div>
        )}
      </div>

      <div style={styles.footer}>
        <div style={styles.footerContent}>
          <p style={styles.footerText}>
            Data from {analyticsData.period.startDate} to {analyticsData.period.endDate} • 
            {analyticsData.overview.sessions} total sessions • 
            {analyticsData.overview.totalUsers} total users •
            {analyticsData.isDemo ? ' Demo Data' : ' Live Data'}
          </p>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: `linear-gradient(135deg, ${colors.bg} 0%, #1a1a1a 100%)`,
    color: colors.white
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    gap: 20
  },
  loadingSpinner: {
    width: 48,
    height: 48,
    border: `4px solid ${colors.border}`,
    borderTop: `4px solid ${colors.yellow}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    fontSize: 18,
    color: colors.grey,
    margin: 0
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    gap: 16,
    textAlign: 'center' as const,
    padding: 40
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 8
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.red,
    margin: 0
  },
  errorMessage: {
    fontSize: 16,
    color: colors.grey,
    margin: 0,
    maxWidth: 400
  },
  retryButton: {
    padding: '12px 24px',
    backgroundColor: colors.yellow,
    color: colors.black,
    border: 'none',
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  },
  content: {
    padding: '0 24px 24px',
    maxWidth: 1400,
    margin: '0 auto'
  },
  overviewTab: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 24
  },
  eventsTab: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 24
  },
  screensTab: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 24
  },
  usersTab: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 24
  },
  engagementTab: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 24
  },
  sectionHeader: {
    textAlign: 'center' as const,
    marginBottom: 32
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.white,
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px'
  },
  sectionSubtitle: {
    fontSize: 16,
    color: colors.grey,
    margin: 0,
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  chartsGrid: {
    display: 'grid',
    // gridTemplateColumns: '1fr 1fr',
    gap: 24,
    marginBottom: 32
  },
  chartCard: {
    background: `linear-gradient(135deg, ${colors.greyhard} 0%, ${colors.bg} 100%)`,
    borderRadius: 16,
    border: `2px solid ${colors.border}`,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'all 0.3s ease'
  },
  metricsCard: {
    background: `linear-gradient(135deg, ${colors.greyhard} 0%, ${colors.bg} 100%)`,
    borderRadius: 16,
    border: `2px solid ${colors.border}`,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  userMetricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 24
  },
  userMetricCard: {
    background: `linear-gradient(135deg, ${colors.greyhard} 0%, ${colors.bg} 100%)`,
    border: `2px solid ${colors.border}`,
    borderRadius: 16,
    padding: 24,
    textAlign: 'center' as const,
    transition: 'all 0.3s ease'
  },
  metricTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.grey,
    margin: '0 0 16px 0'
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 700,
    color: colors.white,
    margin: '0 0 8px 0',
    letterSpacing: '-1px'
  },
  metricLabel: {
    fontSize: 14,
    color: colors.grey,
    margin: '0 0 16px 0'
  },
  metricProgress: {
    width: '100%',
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden' as const
  },
  metricProgressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 1.5s ease-in-out'
  },
  footer: {
    background: colors.greyhard,
    borderTop: `2px solid ${colors.border}`,
    padding: '20px 24px',
    marginTop: 40
  },
  footerContent: {
    maxWidth: 1400,
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20
  },
  footerText: {
    fontSize: 14,
    color: colors.grey,
    margin: 0,
    textAlign: 'center' as const
  }
}

export default AnalyticsScreen