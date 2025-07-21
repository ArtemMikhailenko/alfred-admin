import React from 'react'
import colors from '../../constants/colors'
import { TopScreen, firebaseAnalyticsService } from '../../services/firebaseAnalyticsService'

interface ScreenViewsChartProps {
  screens: TopScreen[]
  timeRange: string
  detailed?: boolean
}

const ScreenViewsChart: React.FC<ScreenViewsChartProps> = ({ screens, timeRange, detailed = false }) => {
  const displayScreens = detailed ? screens : screens.slice(0, 5)
  const totalViews = screens.reduce((sum, screen) => sum + screen.views, 0)

  const getScreenIcon = (screenName: string): string => {
    const name = screenName.toLowerCase()
    if (name.includes('not set') || name.includes('unknown')) return '❓'
    if (name.includes('home') || name.includes('main')) return '🏠'
    if (name.includes('profile') || name.includes('account')) return '👤'
    if (name.includes('settings')) return '⚙️'
    if (name.includes('quiz') || name.includes('test')) return '🧩'
    if (name.includes('course') || name.includes('lesson')) return '📚'
    if (name.includes('subscription') || name.includes('premium')) return '💎'
    if (name.includes('login') || name.includes('auth')) return '🔐'
    if (name.includes('onboarding') || name.includes('welcome')) return '👋'
    return '📱'
  }

  const formatScreenName = (screenName: string): string => {
    if (screenName === '(not set)') return 'Unknown Screen'
    if (screenName === 'Unknown') return 'Untracked Screen'
    return screenName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  const getScreenColor = (index: number): string => {
    const colors_list = [colors.blue, colors.green, colors.yellow, colors.red, colors.grey]
    return colors_list[index % colors_list.length]
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Top Screens</h3>
        <p style={styles.subtitle}>
          Most viewed screens over {timeRange}
        </p>
      </div>

      <div style={styles.screensContainer}>
        {displayScreens.map((screen, index) => {
          const percentage = totalViews > 0 ? (screen.views / totalViews) * 100 : 0
          const screenColor = getScreenColor(index)
          
          return (
            <div key={screen.screenName} style={styles.screenRow}>
              <div style={styles.screenInfo}>
                <div style={styles.screenRank}>#{index + 1}</div>
                <div style={{...styles.screenIcon, backgroundColor: `${screenColor}20`}}>
                  {getScreenIcon(screen.screenName)}
                </div>
                <div style={styles.screenDetails}>
                  <div style={styles.screenName}>{formatScreenName(screen.screenName)}</div>
                  <div style={styles.screenOriginalName}>{screen.screenName}</div>
                </div>
              </div>
              <div style={styles.screenMetrics}>
                <div style={styles.screenViews}>
                  {firebaseAnalyticsService.formatNumber(screen.views)}
                </div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${percentage}%`,
                      backgroundColor: screenColor
                    }}
                  />
                </div>
                <div style={styles.screenPercentage}>
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {screens.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📱</div>
          <h4 style={styles.emptyTitle}>No Screen Data</h4>
          <p style={styles.emptyDescription}>
            Screen view analytics will appear here once users start navigating your app.
          </p>
        </div>
      )}

      <div style={styles.summary}>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Total Views:</span>
          <span style={styles.summaryValue}>
            {firebaseAnalyticsService.formatNumber(totalViews)}
          </span>
        </div>
        <div style={styles.summaryItem}>
          <span style={styles.summaryLabel}>Unique Screens:</span>
          <span style={styles.summaryValue}>{screens.length}</span>
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: `linear-gradient(135deg, ${colors.greyhard} 0%, ${colors.bg} 100%)`,
    border: `2px solid ${colors.border}`,
    borderRadius: 16,
    padding: 24,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    height: '100%'
  },
  header: {
    textAlign: 'center' as const,
    marginBottom: 24
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.white,
    margin: '0 0 8px 0'
  },
  subtitle: {
    fontSize: 14,
    color: colors.grey,
    margin: 0
  },
  screensContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12,
    marginBottom: 20
  },
  screenRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    background: colors.bg,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    transition: 'all 0.2s ease'
  },
  screenInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  screenRank: {
    width: 24,
    height: 24,
    borderRadius: 6,
    background: colors.yellow,
    color: colors.black,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 12,
    fontWeight: 700,
    flexShrink: 0
  },
  screenIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    flexShrink: 0
  },
  screenDetails: {
    flex: 1,
    minWidth: 0
  },
  screenName: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.white,
    marginBottom: 2
  },
  screenOriginalName: {
    fontSize: 11,
    color: colors.grey,
    fontFamily: 'monospace'
  },
  screenMetrics: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 160
  },
  screenViews: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.white,
    minWidth: 48,
    textAlign: 'right' as const
  },
  progressBar: {
    width: 80,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden' as const
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 1s ease-in-out'
  },
  screenPercentage: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.grey,
    minWidth: 40,
    textAlign: 'right' as const
  },
  summary: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: 16,
    background: colors.bg,
    borderRadius: 12,
    border: `1px solid ${colors.border}`
  },
  summaryItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 8
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: 500
  },
  summaryValue: {
    fontSize: 16,
    color: colors.white,
    fontWeight: 700
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: 40,
    background: colors.bg,
    borderRadius: 12,
    border: `2px dashed ${colors.border}`
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.grey,
    margin: '0 0 8px 0'
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.grey,
    margin: 0
  }
}

export default ScreenViewsChart