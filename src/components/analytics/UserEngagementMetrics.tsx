import React from 'react'
import colors from '../../constants/colors'
import { FirebaseAnalyticsOverview, FirebaseEvent, firebaseAnalyticsService } from '../../services/firebaseAnalyticsService'

interface UserEngagementMetricsProps {
  overview: FirebaseAnalyticsOverview
  events: FirebaseEvent[]
  detailed?: boolean
}

const UserEngagementMetrics: React.FC<UserEngagementMetricsProps> = ({ overview, events, detailed = false }) => {
  const calculateEngagementScore = (): number => {
    const sessionDurationScore = Math.min(overview.averageSessionDuration / 300, 1) * 25 // Max 25 points for 5+ min sessions
    const bounceRateScore = (1 - overview.bounceRate) * 25 // Max 25 points for 0% bounce rate
    const screenViewsScore = Math.min(overview.screenViews / overview.sessions / 5, 1) * 25 // Max 25 points for 5+ screens per session
    const retentionScore = Math.min((overview.totalUsers - overview.newUsers) / overview.totalUsers, 1) * 25 // Max 25 points for 100% returning users
    
    return Math.round(sessionDurationScore + bounceRateScore + screenViewsScore + retentionScore)
  }

  const getEngagementLevel = (score: number): { label: string, color: string } => {
    if (score >= 80) return { label: 'Excellent', color: colors.green }
    if (score >= 60) return { label: 'Good', color: colors.yellow }
    if (score >= 40) return { label: 'Fair', color: colors.red }
    return { label: 'Poor', color: colors.red }
  }

  const engagementScore = calculateEngagementScore()
  const engagementLevel = getEngagementLevel(engagementScore)

  const engagementEvents = events.filter(event => 
    event.name.toLowerCase().includes('engagement') ||
    event.name.toLowerCase().includes('interaction') ||
    event.name.toLowerCase().includes('click') ||
    event.name.toLowerCase().includes('tap')
  )

  const metrics = [
    {
      label: 'Session Quality',
      value: firebaseAnalyticsService.formatDuration(overview.averageSessionDuration),
      description: 'Average time users spend in the app',
      score: Math.min(overview.averageSessionDuration / 300, 1) * 100,
      color: colors.blue
    },
    {
      label: 'User Retention',
      value: `${((1 - overview.bounceRate) * 100).toFixed(1)}%`,
      description: 'Users who engage beyond initial screen',
      score: (1 - overview.bounceRate) * 100,
      color: colors.green
    },
    {
      label: 'App Exploration',
      value: `${(overview.screenViews / overview.sessions).toFixed(1)}`,
      description: 'Average screens viewed per session',
      score: Math.min((overview.screenViews / overview.sessions) / 5, 1) * 100,
      color: colors.yellow
    },
    {
      label: 'User Engagement Events',
      value: engagementEvents.reduce((sum, event) => sum + event.count, 0).toString(),
      description: 'Total engagement interactions',
      score: Math.min(engagementEvents.length / 5, 1) * 100,
      color: colors.red
    }
  ]

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>User Engagement Metrics</h3>
        <p style={styles.subtitle}>
          Comprehensive analysis of user behavior and app engagement
        </p>
      </div>

      {/* Overall Engagement Score */}
      <div style={styles.scoreCard}>
        <div style={styles.scoreHeader}>
          <h4 style={styles.scoreTitle}>Overall Engagement Score</h4>
          <div style={styles.scoreLevel}>
            <span style={{...styles.scoreLevelText, color: engagementLevel.color}}>
              {engagementLevel.label}
            </span>
          </div>
        </div>
        <div style={styles.scoreDisplay}>
          <div style={styles.scoreNumber}>{engagementScore}</div>
          <div style={styles.scoreOutOf}>/ 100</div>
        </div>
        <div style={styles.scoreProgress}>
          <div 
            style={{
              ...styles.scoreProgressFill,
              width: `${engagementScore}%`,
              backgroundColor: engagementLevel.color
            }}
          />
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={detailed ? styles.detailedMetricsGrid : styles.metricsGrid}>
        {metrics.map((metric, index) => (
          <div key={index} style={styles.metricCard}>
            <div style={styles.metricHeader}>
              <div style={styles.metricLabel}>{metric.label}</div>
              <div style={styles.metricValue}>{metric.value}</div>
            </div>
            <div style={styles.metricDescription}>{metric.description}</div>
            <div style={styles.metricProgress}>
              <div 
                style={{
                  ...styles.metricProgressFill,
                  width: `${metric.score}%`,
                  backgroundColor: metric.color
                }}
              />
            </div>
            <div style={styles.metricScore}>
              {metric.score.toFixed(0)}% performance
            </div>
          </div>
        ))}
      </div>

      {/* Engagement Events */}
      {detailed && engagementEvents.length > 0 && (
        <div style={styles.eventsSection}>
          <h4 style={styles.eventsTitle}>Engagement Events Breakdown</h4>
          <div style={styles.eventsList}>
            {engagementEvents.slice(0, 6).map((event, index) => (
              <div key={event.name} style={styles.eventItem}>
                <div style={styles.eventName}>{event.name}</div>
                <div style={styles.eventCount}>
                  {firebaseAnalyticsService.formatNumber(event.count)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    background: `linear-gradient(135deg, ${colors.greyhard} 0%, ${colors.bg} 100%)`,
    border: `2px solid ${colors.border}`,
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: 24
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.white,
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey,
    margin: 0
  },
  scoreCard: {
    background: colors.bg,
    border: `2px solid ${colors.border}`,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    textAlign: 'center' as const
  },
  scoreHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  scoreTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.white,
    margin: 0
  },
  scoreLevel: {
    padding: '4px 12px',
    borderRadius: 12,
    background: colors.greyhard
  },
  scoreLevelText: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  scoreDisplay: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 12
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: 700,
    color: colors.white,
    lineHeight: 1
  },
  scoreOutOf: {
    fontSize: 18,
    color: colors.grey,
    fontWeight: 500
  },
  scoreProgress: {
    width: '100%',
    height: 8,
    backgroundColor: colors.border,
    borderRadius: 4,
    overflow: 'hidden' as const
  },
  scoreProgressFill: {
    height: '100%',
    borderRadius: 4,
    transition: 'width 2s ease-in-out'
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 16
  },
  detailedMetricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 20
  },
  metricCard: {
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 12,
    padding: 16
  },
  metricHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  metricLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.grey
  },
  metricValue: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.white
  },
  metricDescription: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 12,
    lineHeight: 1.4
  },
  metricProgress: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden' as const,
    marginBottom: 8
  },
  metricProgressFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 1.5s ease-in-out'
  },
  metricScore: {
    fontSize: 11,
    color: colors.grey,
    fontWeight: 500,
    textAlign: 'right' as const
  },
  eventsSection: {
    marginTop: 24,
    padding: 20,
    background: colors.bg,
    borderRadius: 12,
    border: `1px solid ${colors.border}`
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: colors.white,
    margin: '0 0 16px 0'
  },
  eventsList: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12
  },
  eventItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    background: colors.greyhard,
    borderRadius: 8,
    border: `1px solid ${colors.border}`
  },
  eventName: {
    fontSize: 12,
    color: colors.white,
    fontWeight: 500,
    flex: 1
  },
  eventCount: {
    fontSize: 14,
    color: colors.yellow,
    fontWeight: 700
  }
}

export default UserEngagementMetrics