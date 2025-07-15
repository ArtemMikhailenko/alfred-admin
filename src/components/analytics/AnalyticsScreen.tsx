import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import analyticsService, { QuizAnalytics, UserAnalytics, SessionAnalytics, RealtimeStats } from '../../analyticsService'
import mobileAnalyticsService, { MobileAppAnalytics, MobileUserSession, MobileQuizAnalytics } from '../..//mobileAnalyticsService'

// Components
import AnalyticsHeader from './AnalyticsHeader'
import StatsOverview from './StatsOverview'
import MobileAppsOverview from './MobileAppsOverview'
import MobileDeviceDistribution from './MobileDeviceDistribution'
// import QuizPerformanceChart from '../components/analytics/QuizPerformanceChart'
// import UserEngagementChart from '../components/analytics/UserEngagementChart'
// import RealtimeStatsWidget from '../components/analytics/RealtimeStatsWidget'
// import TopQuizzesTable from '../components/analytics/TopQuizzesTable'
// import UserActivityHeatmap from '../components/analytics/UserActivityHeatmap'
// import ErrorLogsTable from '../components/analytics/ErrorLogsTable'
// import ExportDataButton from '../components/analytics/ExportDataButton'

import styles from './AnalyticsScreen.module.css'
import { RootState } from '../../redux'

type TimeRange = '7d' | '30d' | '90d' | '1y'
type AnalyticsTab = 'overview' | 'mobile' | 'quizzes' | 'users' | 'performance' | 'errors'

const AnalyticsScreen: React.FC = () => {
  const tokens = useSelector((state: RootState) => state.tokens)
  
  // State
  const [timeRange, setTimeRange] = useState<TimeRange>('30d')
  const [activeTab, setActiveTab] = useState<AnalyticsTab>('overview')
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Web Analytics Data
  const [quizAnalytics, setQuizAnalytics] = useState<QuizAnalytics[]>([])
  const [userAnalytics, setUserAnalytics] = useState<UserAnalytics[]>([])
  const [sessionAnalytics, setSessionAnalytics] = useState<SessionAnalytics[]>([])
  const [realtimeStats, setRealtimeStats] = useState<RealtimeStats | null>(null)

  // Mobile Analytics Data
  const [mobileApps, setMobileApps] = useState<MobileAppAnalytics[]>([])
  const [mobileSessions, setMobileSessions] = useState<MobileUserSession[]>([])
  const [mobileQuizzes, setMobileQuizzes] = useState<MobileQuizAnalytics[]>([])
  const [deviceDistribution, setDeviceDistribution] = useState<any>({
    android: { total: 0, topDevices: [], osVersions: [] },
    ios: { total: 0, topDevices: [], osVersions: [] }
  })
  const [geographicData, setGeographicData] = useState<Record<string, number>>({})

  // Computed stats
  const [overviewStats, setOverviewStats] = useState({
    totalUsers: 0,
    totalQuizzes: 0,
    totalSessions: 0,
    averageSessionDuration: 0,
    totalQuizCompletions: 0,
    averageQuizScore: 0,
    activeUsersToday: 0,
    quizCompletionRate: 0,
    // Mobile specific
    mobileUsers: 0,
    mobileSessions: 0,
    topMobilePlatform: 'android'
  })

  useEffect(() => {
    loadAnalyticsData()
    const unsubscribe = setupRealtimeSubscription()

    // Track page view
    if (tokens.email) {
      analyticsService.trackPageView('Analytics Dashboard', tokens.email)
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [timeRange, tokens.email])

  const loadAnalyticsData = async () => {
    setLoading(true)
    setError(null)

    try {
      const days = getTimeRangeDays(timeRange)
      
      // Load web analytics
      const [quizData, sessionData] = await Promise.all([
        analyticsService.getQuizAnalytics(),
        analyticsService.getSessionAnalytics(days)
      ])

      // Load mobile analytics
      const [mobileAppsData, mobileSessionsData, mobileQuizzesData, deviceData, geoData] = await Promise.all([
        mobileAnalyticsService.getMobileAppsOverview(),
        mobileAnalyticsService.getMobileSessions(undefined, days),
        mobileAnalyticsService.getMobileQuizAnalytics(days),
        mobileAnalyticsService.getDeviceDistribution(days),
        mobileAnalyticsService.getGeographicDistribution(days)
      ])

      // Set web data
      setQuizAnalytics(quizData)
      setSessionAnalytics(sessionData)

      // Set mobile data
      setMobileApps(mobileAppsData)
      setMobileSessions(mobileSessionsData)
      setMobileQuizzes(mobileQuizzesData)
      setDeviceDistribution(deviceData)
      setGeographicData(geoData)

      // Calculate combined overview stats
      calculateCombinedOverviewStats(quizData, sessionData, mobileAppsData, mobileSessionsData)

    } catch (err) {
      console.error('Error loading analytics data:', err)
      setError('Failed to load analytics data')
      analyticsService.trackError(err as Error, 'Analytics Dashboard Load')
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    // Web realtime stats
    const unsubscribeWeb = analyticsService.subscribeToRealtimeStats((stats:any) => {
      setRealtimeStats(stats)
    })

    // Mobile realtime stats
    const unsubscribeMobile = mobileAnalyticsService.subscribeMobileRealtimeStats((mobileStats:any) => {
        //@ts-ignore
      setRealtimeStats(prev => ({
        ...prev,
        ...mobileStats
      }))
    })

    return () => {
      unsubscribeWeb()
      unsubscribeMobile()
    }
  }

  const getTimeRangeDays = (range: TimeRange): number => {
    switch (range) {
      case '7d': return 7
      case '30d': return 30
      case '90d': return 90
      case '1y': return 365
      default: return 30
    }
  }

  const calculateCombinedOverviewStats = (
    quizData: QuizAnalytics[], 
    sessionData: SessionAnalytics[],
    mobileAppsData: MobileAppAnalytics[],
    mobileSessionsData: MobileUserSession[]
  ) => {
    // Web stats
    const webQuizCompletions = quizData.reduce((sum, quiz) => sum + quiz.completions, 0)
    const webQuizAttempts = quizData.reduce((sum, quiz) => sum + (quiz.completions / (quiz.successRate / 100)), 0)
    const webAverageQuizScore = quizData.length > 0 
      ? quizData.reduce((sum, quiz) => sum + quiz.averageScore, 0) / quizData.length 
      : 0

    const webUniqueUsers = new Set(sessionData.map(session => session.userId)).size
    const webTotalSessionDuration = sessionData.reduce((sum, session) => sum + (session.duration || 0), 0)
    const webAverageSessionDuration = sessionData.length > 0 ? webTotalSessionDuration / sessionData.length : 0

    // Mobile stats
    const mobileUsers = mobileAppsData.reduce((sum, app) => sum + app.totalUsers, 0)
    const mobileSessions = mobileSessionsData.length
    const mobileUniqueUsers = new Set(mobileSessionsData.map(session => session.userId)).size
    
    const androidUsers = mobileAppsData.find(app => app.platform === 'android')?.totalUsers || 0
    const iosUsers = mobileAppsData.find(app => app.platform === 'ios')?.totalUsers || 0
    const topMobilePlatform = androidUsers > iosUsers ? 'android' : 'ios'

    // Combined stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const webActiveUsersToday = sessionData.filter(session => 
      session.startTime >= today
    ).length
    const mobileActiveUsersToday = mobileSessionsData.filter(session => 
      session.startTime >= today
    ).length

    setOverviewStats({
      totalUsers: webUniqueUsers + mobileUniqueUsers,
      totalQuizzes: quizData.length,
      totalSessions: sessionData.length + mobileSessions,
      averageSessionDuration: webAverageSessionDuration,
      totalQuizCompletions: webQuizCompletions,
      averageQuizScore: webAverageQuizScore,
      activeUsersToday: webActiveUsersToday + mobileActiveUsersToday,
      quizCompletionRate: webQuizAttempts > 0 ? (webQuizCompletions / webQuizAttempts) * 100 : 0,
      mobileUsers,
      mobileSessions,
      topMobilePlatform
    })
  }

  const handleExportData = async () => {
    try {
      const exportData = {
        webAnalytics: {
          quizAnalytics,
          sessionAnalytics,
        },
        mobileAnalytics: {
          apps: mobileApps,
          sessions: mobileSessions,
          quizzes: mobileQuizzes,
          deviceDistribution,
          geographicData
        },
        overviewStats,
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

      analyticsService.trackCustomEvent('analytics_export', { timeRange, includesMobile: true })
    } catch (err) {
      console.error('Error exporting data:', err)
      analyticsService.trackError(err as Error, 'Analytics Export')
    }
  }

  if (loading && quizAnalytics.length === 0 && mobileApps.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner} />
          <p className={styles.loadingText}>Loading analytics data...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorContainer}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Error Loading Analytics</h2>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryButton} onClick={loadAnalyticsData}>
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <AnalyticsHeader
        timeRange={timeRange}
        setTimeRange={setTimeRange}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExport={handleExportData}
      />

      {/* {realtimeStats && (
        <RealtimeStatsWidget stats={realtimeStats} />
      )} */}

      <div className={styles.content}>
        {activeTab === 'overview' && (
          <div className={styles.overviewTab}>
            <StatsOverview stats={overviewStats} />
            
            <div className={styles.chartsGrid}>
              {/* <div className={styles.chartCard}>
                <QuizPerformanceChart 
                  data={quizAnalytics} 
                  timeRange={timeRange}
                />
              </div> */}
              
              {/* <div className={styles.chartCard}>
                <UserEngagementChart 
                  data={sessionAnalytics} 
                  timeRange={timeRange}
                />
              </div> */}
            </div>

            {/* <div className={styles.tablesGrid}>
              <TopQuizzesTable quizzes={quizAnalytics.slice(0, 10)} />
              <UserActivityHeatmap sessions={sessionAnalytics} />
            </div> */}
          </div>
        )}

        {activeTab === 'mobile' && (
          <div className={styles.mobileTab}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Mobile Applications Analytics</h2>
              <p className={styles.sectionSubtitle}>
                Comprehensive analytics for Android and iOS applications
              </p>
            </div>

            <MobileAppsOverview 
              apps={mobileApps} 
              loading={loading}
            />
            
            <div className={styles.mobileGrid}>
              <div className={styles.mobileCard}>
                <MobileDeviceDistribution 
                  data={deviceDistribution}
                  loading={loading}
                />
              </div>
              
              <div className={styles.mobileCard}>
                <div className={styles.geographicSection}>
                  <h3 className={styles.geographicTitle}>Geographic Distribution</h3>
                  <div className={styles.countryList}>
                    {Object.entries(geographicData).slice(0, 10).map(([country, count]) => (
                      <div key={country} className={styles.countryItem}>
                        <span className={styles.countryName}>{country}</span>
                        <span className={styles.countryCount}>{count} users</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {mobileQuizzes.length > 0 && (
              <div className={styles.mobileQuizSection}>
                <h3 className={styles.sectionSubtitle}>Mobile Quiz Performance</h3>
                <div className={styles.mobileQuizGrid}>
                  {mobileQuizzes.slice(0, 6).map((quiz) => (
                    <div key={`${quiz.quizId}_${quiz.platform}`} className={styles.mobileQuizCard}>
                      <div className={styles.mobileQuizHeader}>
                        <span className={styles.mobileQuizIcon}>
                          {quiz.platform === 'android' ? '🤖' : '📱'}
                        </span>
                        <span className={styles.mobileQuizTitle}>Quiz {quiz.quizId}</span>
                        <span className={styles.mobileQuizPlatform}>{quiz.platform}</span>
                      </div>
                      <div className={styles.mobileQuizStats}>
                        <div className={styles.mobileQuizStat}>
                          <span className={styles.mobileQuizStatValue}>{quiz.completions}</span>
                          <span className={styles.mobileQuizStatLabel}>Completions</span>
                        </div>
                        <div className={styles.mobileQuizStat}>
                          <span className={styles.mobileQuizStatValue}>{quiz.averageScore.toFixed(1)}</span>
                          <span className={styles.mobileQuizStatLabel}>Avg Score</span>
                        </div>
                        <div className={styles.mobileQuizStat}>
                          <span className={styles.mobileQuizStatValue}>{quiz.completionRate.toFixed(1)}%</span>
                          <span className={styles.mobileQuizStatLabel}>Completion Rate</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className={styles.quizzesTab}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Quiz Performance Analysis</h2>
              <p className={styles.sectionSubtitle}>
                Detailed insights into quiz completion rates, scores, and user engagement
              </p>
            </div>

            {/* <QuizPerformanceChart 
              data={quizAnalytics} 
              timeRange={timeRange}
              detailed={true}
            />
            
            <TopQuizzesTable 
              quizzes={quizAnalytics} 
              showAllColumns={true}
            /> */}
          </div>
        )}

        {/* {activeTab === 'users' && (
          <div className={styles.usersTab}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>User Engagement Analysis</h2>
              <p className={styles.sectionSubtitle}>
                User behavior patterns, session analytics, and engagement metrics
              </p>
            </div>

            <UserEngagementChart 
              data={sessionAnalytics} 
              timeRange={timeRange}
              detailed={true}
            />
            
            <UserActivityHeatmap 
              sessions={sessionAnalytics}
              detailed={true}
            />
          </div>
        )} */}

        {activeTab === 'performance' && (
          <div className={styles.performanceTab}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Performance Metrics</h2>
              <p className={styles.sectionSubtitle}>
                Application performance, load times, and technical metrics
              </p>
            </div>

            <div className={styles.performanceGrid}>
              <div className={styles.performanceCard}>
                <h3>Web Application Performance</h3>
                <div className={styles.comingSoon}>
                  <p>Web performance metrics coming soon...</p>
                </div>
              </div>
              
              <div className={styles.performanceCard}>
                <h3>Mobile Application Performance</h3>
                <div className={styles.comingSoon}>
                  <p>Mobile performance metrics coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'errors' && (
          <div className={styles.errorsTab}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Error Logs & Monitoring</h2>
              <p className={styles.sectionSubtitle}>
                Application errors, crashes, and system monitoring
              </p>
            </div>

            <div className={styles.errorsGrid}>
              {/* <div className={styles.errorCard}>
                <h3>Web Application Errors</h3>
                <ErrorLogsTable timeRange={timeRange} />
              </div> */}
              
              <div className={styles.errorCard}>
                <h3>Mobile Application Crashes</h3>
                <div className={styles.comingSoon}>
                  <p>Mobile crash reports coming soon...</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Data refreshed {loading ? 'now' : 'a few seconds ago'} • 
            Showing data for {timeRange} • 
            {overviewStats.totalSessions} total sessions analyzed •
            {mobileApps.length} mobile apps monitored
          </p>
          {/* <ExportDataButton onExport={handleExportData} /> */}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsScreen