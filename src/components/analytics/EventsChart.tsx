import React from 'react'
import colors from '../../constants/colors'
import { FirebaseEvent, firebaseAnalyticsService } from '../../services/firebaseAnalyticsService'

interface EventsChartProps {
  events: FirebaseEvent[]
  timeRange: string
  detailed?: boolean
}

const EventsChart: React.FC<EventsChartProps> = ({ events, timeRange, detailed = false }) => {
  const displayEvents = detailed ? events : events.slice(0, 8)
  const maxCount = Math.max(...events.map(e => e.count))

  const getEventIcon = (eventName: string): string => {
    const name = eventName.toLowerCase()
    if (name.includes('user_engagement')) return '🎯'
    if (name.includes('screen_view')) return '👀'
    if (name.includes('app_close')) return '❌'
    if (name.includes('app_open')) return '📱'
    if (name.includes('session_start')) return '🚀'
    if (name.includes('first_open')) return '🆕'
    if (name.includes('subscription')) return '💳'
    if (name.includes('purchase')) return '💰'
    if (name.includes('error')) return '⚠️'
    if (name.includes('cancel')) return '🚫'
    if (name.includes('update')) return '🔄'
    if (name.includes('remove')) return '🗑️'
    return '📊'
  }

  const getEventColor = (eventName: string): string => {
    const name = eventName.toLowerCase()
    if (name.includes('error') || name.includes('cancel') || name.includes('remove')) return colors.red
    if (name.includes('purchase') || name.includes('success')) return colors.green
    if (name.includes('subscription')) return colors.yellow
    if (name.includes('engagement') || name.includes('session')) return colors.blue
    return colors.grey
  }

  const formatEventName = (eventName: string): string => {
    return eventName
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Top Events</h3>
        <p style={styles.subtitle}>
          Most triggered events over {timeRange}
        </p>
      </div>

      <div style={styles.eventsContainer}>
        {displayEvents.map((event, index) => {
          const percentage = (event.count / maxCount) * 100
          const eventColor = getEventColor(event.name)
          
          return (
            <div key={event.name} style={styles.eventRow}>
              <div style={styles.eventInfo}>
                <div style={styles.eventRank}>#{index + 1}</div>
                <div style={{...styles.eventIcon, backgroundColor: `${eventColor}20`}}>
                  {getEventIcon(event.name)}
                </div>
                <div style={styles.eventDetails}>
                  <div style={styles.eventName}>{formatEventName(event.name)}</div>
                  <div style={styles.eventOriginalName}>{event.name}</div>
                </div>
              </div>
              <div style={styles.eventMetrics}>
                <div style={styles.eventCount}>
                  {firebaseAnalyticsService.formatNumber(event.count)}
                </div>
                <div style={styles.progressBar}>
                  <div 
                    style={{
                      ...styles.progressFill,
                      width: `${percentage}%`,
                      backgroundColor: eventColor
                    }}
                  />
                </div>
                <div style={styles.eventPercentage}>
                  {percentage.toFixed(1)}%
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {events.length === 0 && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📊</div>
          <h4 style={styles.emptyTitle}>No Events Data</h4>
          <p style={styles.emptyDescription}>
            Event analytics will appear here once users start interacting with your app.
          </p>
        </div>
      )}

      {!detailed && events.length > 8 && (
        <div style={styles.showMoreButton}>
          <span style={styles.showMoreText}>
            +{events.length - 8} more events
          </span>
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
  eventsContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12
  },
  eventRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    background: colors.bg,
    borderRadius: 12,
    border: `1px solid ${colors.border}`,
    transition: 'all 0.2s ease'
  },
  eventInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  eventRank: {
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
  eventIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    flexShrink: 0
  },
  eventDetails: {
    flex: 1,
    minWidth: 0
  },
  eventName: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.white,
    marginBottom: 2
  },
  eventOriginalName: {
    fontSize: 11,
    color: colors.grey,
    fontFamily: 'monospace'
  },
  eventMetrics: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 160
  },
  eventCount: {
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
  eventPercentage: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.grey,
    minWidth: 40,
    textAlign: 'right' as const
  },
  showMoreButton: {
    display: 'flex',
    justifyContent: 'center',
    padding: 16,
    marginTop: 8,
    background: colors.bg,
    borderRadius: 12,
    border: `2px dashed ${colors.border}`
  },
  showMoreText: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: 500
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

export default EventsChart