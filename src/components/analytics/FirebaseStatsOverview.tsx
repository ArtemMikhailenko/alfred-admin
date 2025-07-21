import React from 'react'
import colors from '../../constants/colors'
import { FirebaseAnalyticsResponse, firebaseAnalyticsService } from '../../services/firebaseAnalyticsService'

interface FirebaseStatsOverviewProps {
  data: FirebaseAnalyticsResponse
}

const FirebaseStatsOverview: React.FC<FirebaseStatsOverviewProps> = ({ data }) => {
  const { overview } = data

  const overviewStats = [
    { 
      icon: '👥', 
      label: 'Total Users', 
      value: firebaseAnalyticsService.formatNumber(overview.totalUsers),
      color: colors.blue,
      trend: overview.newUsers > 0 ? `+${overview.newUsers} new` : null
    },
    { 
      icon: '🔥', 
      label: 'Active Users', 
      value: firebaseAnalyticsService.formatNumber(overview.activeUsers),
      color: colors.green,
      trend: `${((overview.activeUsers / overview.totalUsers) * 100).toFixed(1)}% of total`
    },
    { 
      icon: '📊', 
      label: 'Sessions', 
      value: firebaseAnalyticsService.formatNumber(overview.sessions),
      color: colors.yellow,
      trend: `${(overview.sessions / overview.totalUsers).toFixed(1)} per user`
    },
    { 
      icon: '👀', 
      label: 'Screen Views', 
      value: firebaseAnalyticsService.formatNumber(overview.screenViews),
      color: colors.red,
      trend: `${(overview.screenViews / overview.sessions).toFixed(1)} per session`
    },
    { 
      icon: '⏱️', 
      label: 'Avg Session Duration', 
      value: firebaseAnalyticsService.formatDuration(overview.averageSessionDuration),
      color: colors.blue,
      trend: overview.bounceRate < 0.3 ? 'Good engagement' : 'Low engagement'
    },
    { 
      icon: '📈', 
      label: 'Bounce Rate', 
      value: `${(overview.bounceRate * 100).toFixed(1)}%`,
      color: overview.bounceRate < 0.3 ? colors.green : overview.bounceRate < 0.6 ? colors.yellow : colors.red,
      trend: overview.bounceRate < 0.3 ? 'Excellent' : overview.bounceRate < 0.6 ? 'Good' : 'Needs improvement'
    }
  ]

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Analytics Overview</h3>
        <p style={styles.subtitle}>
          Key metrics from {data.period.startDate} to {data.period.endDate}
          {data.isDemo && <span style={styles.demoLabel}> • Demo Data</span>}
        </p>
      </div>
      
      <div style={styles.statsGrid}>
        {overviewStats.map((stat, index) => (
          <div key={index} style={styles.statCard}>
            <div style={styles.statHeader}>
              <div style={{...styles.statIcon, backgroundColor: `${stat.color}20`, borderColor: stat.color}}>
                <span style={styles.statIconText}>{stat.icon}</span>
              </div>
              <div style={styles.statInfo}>
                <div style={styles.statValue}>{stat.value}</div>
                <div style={styles.statLabel}>{stat.label}</div>
                {stat.trend && (
                  <div style={{...styles.statTrend, color: stat.color}}>
                    {stat.trend}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    marginBottom: 32
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: 32
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.white,
    margin: '0 0 8px 0',
    letterSpacing: '-0.5px'
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey,
    margin: 0
  },
  demoLabel: {
    color: colors.yellow,
    fontWeight: 600
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: 20
  },
  statCard: {
    background: `linear-gradient(135deg, ${colors.greyhard} 0%, ${colors.bg} 100%)`,
    border: `2px solid ${colors.border}`,
    borderRadius: 16,
    padding: 20,
    transition: 'all 0.3s ease',
    cursor: 'default'
  },
  statHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 16
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px solid',
    flexShrink: 0
  },
  statIconText: {
    fontSize: 24
  },
  statInfo: {
    flex: 1,
    minWidth: 0
  },
  statValue: {
    fontSize: 28,
    fontWeight: 700,
    color: colors.white,
    marginBottom: 4,
    letterSpacing: '-1px'
  },
  statLabel: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: 500,
    marginBottom: 4
  },
  statTrend: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  }
}

export default FirebaseStatsOverview
