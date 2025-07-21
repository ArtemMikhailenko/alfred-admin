import React from 'react'
import colors from '../../constants/colors'
import { useNavigate } from 'react-router-dom'

type TimeRange = '7d' | '30d' | '90d' | '1y'
type AnalyticsTab = 'overview' | 'events' | 'screens' | 'users' | 'engagement'

interface AnalyticsHeaderProps {
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void
  activeTab: AnalyticsTab
  setActiveTab: (tab: AnalyticsTab) => void
  onExport: () => void
}

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  timeRange,
  setTimeRange,
  activeTab,
  setActiveTab,
  onExport
}) => {
  const navigate = useNavigate()
  
  const timeRangeOptions = [
    { value: '7d', label: '7 days' },
    { value: '30d', label: '30 days' },
    { value: '90d', label: '90 days' },
    { value: '1y', label: '1 year' }
  ]

  const tabs = [
    { value: 'overview', label: 'Overview', icon: '📊' },
    { value: 'events', label: 'Events', icon: '⚡' },
    { value: 'screens', label: 'Screens', icon: '📱' },
    { value: 'users', label: 'Users', icon: '👥' },
    { value: 'engagement', label: 'Engagement', icon: '🎯' }
  ]

  return (
    <div style={styles.container}>
      <div style={styles.topNav}>
        <div style={styles.breadcrumb}>
          <button 
            onClick={() => navigate('/admin')}
            style={styles.breadcrumbLink}
          >
            <span>🏠</span>
            Admin Panel
          </button>
          <span style={styles.breadcrumbSeparator}>›</span>
          <span style={styles.breadcrumbCurrent}>Analytics</span>
        </div>
        <div style={styles.actions}>
          <button onClick={onExport} style={styles.exportButton}>
            <span>📁</span>
            Export Data
          </button>
        </div>
      </div>

      <div style={styles.mainHeader}>
        <div style={styles.titleSection}>
          <h1 style={styles.title}>Firebase Analytics Dashboard</h1>
          <p style={styles.subtitle}>
            Mobile app analytics powered by Google Firebase
          </p>
        </div>
        <div style={styles.controls}>
          <div style={styles.timeRangeSelector}>
            <label style={styles.selectorLabel}>Time Range</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
              style={styles.select}
            >
              {timeRangeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div style={styles.tabNavigation}>
        <div style={styles.tabList}>
          {tabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value as AnalyticsTab)}
              style={{
                ...styles.tab,
                ...(activeTab === tab.value ? styles.tabActive : {}),
                color: activeTab === tab.value ? colors.yellow : colors.grey,
                backgroundColor: activeTab === tab.value ? colors.greyhard : 'transparent'
              }}
            >
              <span style={styles.tabIcon}>{tab.icon}</span>
              <span style={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: {
    background: `linear-gradient(135deg, ${colors.greyhard} 0%, ${colors.bg} 100%)`,
    borderBottom: `2px solid ${colors.border}`,
    position: 'sticky' as const,
    top: 0,
    zIndex: 1000,
    backdropFilter: 'blur(8px)'
  },
  topNav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 24px',
    borderBottom: `1px solid ${colors.border}`
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14
  },
  breadcrumbLink: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: colors.yellow,
    textDecoration: 'none',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 6,
    transition: 'all 0.2s ease',
    fontSize: 14,
    fontWeight: 500
  },
  breadcrumbSeparator: {
    color: colors.grey,
    fontWeight: 300
  },
  breadcrumbCurrent: {
    color: colors.white,
    fontWeight: 600
  },
  actions: {
    display: 'flex',
    gap: 12
  },
  exportButton: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 16px',
    backgroundColor: colors.greyhard,
    color: colors.grey,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    transition: 'all 0.2s ease'
  },
  mainHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 24,
    gap: 24
  },
  titleSection: {
    flex: 1
  },
  title: {
    fontSize: 32,
    fontWeight: 700,
    color: colors.white,
    margin: '0 0 8px 0',
    letterSpacing: '-0.8px',
    background: `linear-gradient(135deg, ${colors.white} 0%, ${colors.yellow} 100%)`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  subtitle: {
    fontSize: 16,
    color: colors.grey,
    margin: 0,
    fontWeight: 400
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: 20
  },
  timeRangeSelector: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 6,
    minWidth: 160
  },
  selectorLabel: {
    fontSize: 12,
    fontWeight: 600,
    color: colors.grey,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px'
  },
  select: {
    padding: '8px 12px',
    backgroundColor: colors.bg,
    color: colors.white,
    border: `2px solid ${colors.border}`,
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    appearance: 'none' as const,
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 8px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: 32
  },
  tabNavigation: {
    padding: '0 24px',
    overflowX: 'auto' as const
  },
  tabList: {
    display: 'flex',
    gap: 4,
    borderBottom: `2px solid ${colors.border}`,
    minWidth: 'max-content'
  },
  tab: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 20px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 500,
    color: colors.grey,
    borderRadius: '8px 8px 0 0',
    transition: 'all 0.2s ease',
    position: 'relative' as const,
    whiteSpace: 'nowrap' as const
  },
  tabActive: {
    color: colors.yellow,
    backgroundColor: colors.greyhard,
    borderBottom: `2px solid ${colors.yellow}`
  },
  tabIcon: {
    fontSize: 16,
    display: 'flex',
    alignItems: 'center'
  },
  tabLabel: {
    fontWeight: 600
  }
}

export default AnalyticsHeader