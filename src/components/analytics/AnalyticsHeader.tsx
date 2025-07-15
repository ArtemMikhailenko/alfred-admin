import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './AnalyticsHeader.module.css'

type TimeRange = '7d' | '30d' | '90d' | '1y'
type AnalyticsTab = 'overview' | 'mobile' | 'quizzes' | 'users' | 'performance' | 'errors'

interface AnalyticsHeaderProps {
  timeRange: TimeRange
  setTimeRange: (range: TimeRange) => void
  activeTab: AnalyticsTab
  setActiveTab: (tab: AnalyticsTab) => void
  onExport: () => void
}

const timeRangeOptions = [
  { value: '7d' as TimeRange, label: 'Last 7 days' },
  { value: '30d' as TimeRange, label: 'Last 30 days' },
  { value: '90d' as TimeRange, label: 'Last 90 days' },
  { value: '1y' as TimeRange, label: 'Last year' }
]

const tabOptions = [
  { value: 'overview' as AnalyticsTab, label: 'Overview', icon: '📊' },
  { value: 'mobile' as AnalyticsTab, label: 'Mobile', icon: '📱' },
  { value: 'quizzes' as AnalyticsTab, label: 'Quizzes', icon: '🎯' },
  { value: 'users' as AnalyticsTab, label: 'Users', icon: '👥' },
  { value: 'performance' as AnalyticsTab, label: 'Performance', icon: '⚡' },
  { value: 'errors' as AnalyticsTab, label: 'Errors', icon: '🚨' }
]

const AnalyticsHeader: React.FC<AnalyticsHeaderProps> = ({
  timeRange,
  setTimeRange,
  activeTab,
  setActiveTab,
  onExport
}) => {
  const navigate = useNavigate()

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <div className={styles.topNav}>
        <div className={styles.breadcrumb}>
          <button 
            className={styles.breadcrumbLink}
            onClick={() => navigate('/admin')}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path 
                d="M10 3L3 9V17C3 17.5523 3.44772 18 4 18H7V14H13V18H16C16.5523 18 17 17.5523 17 17V9L10 3Z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinejoin="round"
              />
            </svg>
            Admin Panel
          </button>
          <span className={styles.breadcrumbSeparator}>›</span>
          <span className={styles.breadcrumbCurrent}>Analytics</span>
        </div>

        <div className={styles.actions}>
          <button className={styles.exportButton} onClick={onExport}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path 
                d="M8 1V11M8 11L11 8M8 11L5 8M3 13H13" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            Export Data
          </button>
        </div>
      </div>

      {/* Main Header */}
      <div className={styles.mainHeader}>
        <div className={styles.titleSection}>
          <h1 className={styles.title}>Analytics Dashboard</h1>
          <p className={styles.subtitle}>
            Track user engagement, quiz performance, and application metrics
          </p>
        </div>

        <div className={styles.controls}>
          <div className={styles.timeRangeSelector}>
            <label className={styles.selectorLabel}>Time Range</label>
            <select 
              className={styles.select}
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as TimeRange)}
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

      {/* Tab Navigation */}
      <div className={styles.tabNavigation}>
        <div className={styles.tabList}>
          {tabOptions.map(tab => (
            <button
              key={tab.value}
              className={`${styles.tab} ${activeTab === tab.value ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.value)}
            >
              <span className={styles.tabIcon}>{tab.icon}</span>
              <span className={styles.tabLabel}>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsHeader