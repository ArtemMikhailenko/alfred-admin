// components/analytics/MobileDeviceDistribution.tsx
import React from 'react'
import colors from '../../constants/colors'

interface DeviceDistribution {
  android: {
    total: number
    topDevices: [string, number][]
    osVersions: [string, number][]
  }
  ios: {
    total: number
    topDevices: [string, number][]
    osVersions: [string, number][]
  }
}

interface MobileDeviceDistributionProps {
  data: DeviceDistribution
  loading?: boolean
}

const MobileDeviceDistribution: React.FC<MobileDeviceDistributionProps> = ({ data, loading }) => {
  const formatPercentage = (value: number, total: number): string => {
    if (total === 0) return '0%'
    return `${((value / total) * 100).toFixed(1)}%`
  }

  const getDeviceIcon = (deviceName: string): string => {
    const device = deviceName.toLowerCase()
    if (device.includes('iphone')) return '📱'
    if (device.includes('ipad')) return '📱'
    if (device.includes('samsung')) return '📱'
    if (device.includes('pixel')) return '📱'
    if (device.includes('huawei')) return '📱'
    if (device.includes('xiaomi')) return '📱'
    if (device.includes('oneplus')) return '📱'
    return '📱'
  }

  const getOSIcon = (platform: 'android' | 'ios'): string => {
    return platform === 'android' ? '🤖' : '🍎'
  }

  const renderDeviceList = (devices: [string, number][], total: number, platform: 'android' | 'ios') => {
    if (devices.length === 0) {
      return (
        <div style={styles.emptyDevices}>
          <p style={styles.emptyText}>No device data available</p>
        </div>
      )
    }

    return (
      <div style={styles.deviceList}>
        {devices.slice(0, 8).map(([device, count], index) => (
          <div key={device} style={styles.deviceItem}>
            <div style={styles.deviceInfo}>
              <span style={styles.deviceIcon}>{getDeviceIcon(device)}</span>
              <div style={styles.deviceDetails}>
                <span style={styles.deviceName}>{device}</span>
                <span style={styles.deviceCount}>{count} users</span>
              </div>
            </div>
            <div style={styles.deviceStats}>
              <div style={styles.devicePercentage}>
                {formatPercentage(count, total)}
              </div>
              <div style={styles.deviceBar}>
                <div 
                  style={{
                    ...styles.deviceBarFill,
                    width: `${(count / total) * 100}%`,
                    backgroundColor: platform === 'android' ? colors.green : colors.blue
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderOSVersions = (versions: [string, number][], total: number, platform: 'android' | 'ios') => {
    if (versions.length === 0) {
      return (
        <div style={styles.emptyVersions}>
          <p style={styles.emptyText}>No OS version data available</p>
        </div>
      )
    }

    return (
      <div style={styles.versionGrid}>
        {versions.slice(0, 6).map(([version, count], index) => (
          <div key={version} style={styles.versionCard}>
            <div style={styles.versionHeader}>
              <span style={styles.versionIcon}>{getOSIcon(platform)}</span>
              <span style={styles.versionName}>{version}</span>
            </div>
            <div style={styles.versionStats}>
              <div style={styles.versionCount}>{count}</div>
              <div style={styles.versionPercentage}>
                {formatPercentage(count, total)}
              </div>
            </div>
            <div style={styles.versionProgress}>
              <div 
                style={{
                  ...styles.versionProgressFill,
                  width: `${(count / total) * 100}%`,
                  backgroundColor: platform === 'android' ? colors.green : colors.blue
                }}
              />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h3 style={styles.title}>Device & OS Distribution</h3>
          <p style={styles.subtitle}>Loading device analytics...</p>
        </div>
        <div style={styles.loadingGrid}>
          {[1, 2].map(i => (
            <div key={i} style={styles.loadingCard}>
              <div style={styles.loadingSkeleton} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const totalUsers = data.android.total + data.ios.total
  const androidPercentage = totalUsers > 0 ? (data.android.total / totalUsers) * 100 : 0
  const iosPercentage = totalUsers > 0 ? (data.ios.total / totalUsers) * 100 : 0

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>Device & OS Distribution</h3>
        <p style={styles.subtitle}>
          Device models and operating system versions breakdown
        </p>
      </div>

      {/* Platform Overview */}
      <div style={styles.platformOverview}>
        <div style={styles.platformCard}>
          <div style={styles.platformHeader}>
            <span style={styles.platformIcon}>🤖</span>
            <span style={styles.platformName}>Android</span>
          </div>
          <div style={styles.platformStats}>
            <div style={styles.platformCount}>{data.android.total}</div>
            <div style={styles.platformPercentage}>{androidPercentage.toFixed(1)}%</div>
          </div>
        </div>

        <div style={styles.platformCard}>
          <div style={styles.platformHeader}>
            <span style={styles.platformIcon}>🍎</span>
            <span style={styles.platformName}>iOS</span>
          </div>
          <div style={styles.platformStats}>
            <div style={styles.platformCount}>{data.ios.total}</div>
            <div style={styles.platformPercentage}>{iosPercentage.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Device Distribution */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>Top Devices</h4>
        <div style={styles.devicesGrid}>
          <div style={styles.deviceSection}>
            <div style={styles.deviceSectionHeader}>
              <span style={styles.deviceSectionIcon}>🤖</span>
              <span style={styles.deviceSectionTitle}>Android Devices</span>
              <span style={styles.deviceSectionCount}>({data.android.total} users)</span>
            </div>
            {renderDeviceList(data.android.topDevices, data.android.total, 'android')}
          </div>

          <div style={styles.deviceSection}>
            <div style={styles.deviceSectionHeader}>
              <span style={styles.deviceSectionIcon}>🍎</span>
              <span style={styles.deviceSectionTitle}>iOS Devices</span>
              <span style={styles.deviceSectionCount}>({data.ios.total} users)</span>
            </div>
            {renderDeviceList(data.ios.topDevices, data.ios.total, 'ios')}
          </div>
        </div>
      </div>

      {/* OS Versions */}
      <div style={styles.section}>
        <h4 style={styles.sectionTitle}>OS Versions</h4>
        <div style={styles.versionsGrid}>
          <div style={styles.versionSection}>
            <div style={styles.versionSectionHeader}>
              <span style={styles.versionSectionIcon}>🤖</span>
              <span style={styles.versionSectionTitle}>Android Versions</span>
            </div>
            {renderOSVersions(data.android.osVersions, data.android.total, 'android')}
          </div>

          <div style={styles.versionSection}>
            <div style={styles.versionSectionHeader}>
              <span style={styles.versionSectionIcon}>🍎</span>
              <span style={styles.versionSectionTitle}>iOS Versions</span>
            </div>
            {renderOSVersions(data.ios.osVersions, data.ios.total, 'ios')}
          </div>
        </div>
      </div>

      {totalUsers === 0 && !loading && (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📱</div>
          <h4 style={styles.emptyTitle}>No Device Data</h4>
          <p style={styles.emptyDescription}>
            Device distribution data will appear here once mobile users start using your apps.
          </p>
        </div>
      )}
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
  
  // Platform Overview
  platformOverview: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 20,
    marginBottom: 32
  },
  platformCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    background: `linear-gradient(135deg, ${colors.greyhard} 0%, ${colors.bg} 100%)`,
    border: `2px solid ${colors.border}`,
    borderRadius: 16,
    transition: 'all 0.3s ease'
  },
  platformHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  platformIcon: {
    width: 48,
    height: 48,
    background: `linear-gradient(135deg, ${colors.yellow}30 0%, ${colors.greyhard} 100%)`,
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
    border: `1px solid ${colors.border}`
  },
  platformName: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.white
  },
  platformStats: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    textAlign: 'center' as const
  },
  platformCount: {
    fontSize: 24,
    fontWeight: 700,
    color: colors.yellow,
    marginBottom: 4
  },
  platformPercentage: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: 500
  },

  // Sections
  section: {
    marginBottom: 32
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.white,
    margin: '0 0 20px 0',
    letterSpacing: '-0.3px'
  },

  // Device Distribution
  devicesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24
  },
  deviceSection: {
    background: `linear-gradient(135deg, ${colors.greyhard} 0%, ${colors.bg} 100%)`,
    border: `2px solid ${colors.border}`,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  deviceSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: `1px solid ${colors.border}`
  },
  deviceSectionIcon: {
    fontSize: 20
  },
  deviceSectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.white,
    flex: 1
  },
  deviceSectionCount: {
    fontSize: 13,
    color: colors.grey,
    fontWeight: 500
  },
  deviceList: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 12
  },
  deviceItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    transition: 'all 0.2s ease'
  },
  deviceInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1
  },
  deviceIcon: {
    fontSize: 20,
    width: 32,
    height: 32,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: colors.greyhard,
    borderRadius: 8,
    border: `1px solid ${colors.border}`
  },
  deviceDetails: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 2
  },
  deviceName: {
    fontSize: 14,
    fontWeight: 500,
    color: colors.white
  },
  deviceCount: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: 500
  },
  deviceStats: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    minWidth: 100
  },
  devicePercentage: {
    fontSize: 13,
    fontWeight: 600,
    color: colors.grey,
    minWidth: 40,
    textAlign: 'right' as const
  },
  deviceBar: {
    width: 60,
    height: 6,
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: 'hidden' as const
  },
  deviceBarFill: {
    height: '100%',
    borderRadius: 3,
    transition: 'width 1.5s ease-in-out'
  },

  // OS Versions
  versionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24
  },
  versionSection: {
    background: `linear-gradient(135deg, ${colors.greyhard} 0%, ${colors.bg} 100%)`,
    border: `2px solid ${colors.border}`,
    borderRadius: 16,
    padding: 20,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
  },
  versionSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 12,
    borderBottom: `1px solid ${colors.border}`
  },
  versionSectionIcon: {
    fontSize: 20
  },
  versionSectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: colors.white
  },
  versionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12
  },
  versionCard: {
    background: colors.bg,
    border: `1px solid ${colors.border}`,
    borderRadius: 8,
    padding: 16,
    transition: 'all 0.2s ease'
  },
  versionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12
  },
  versionIcon: {
    fontSize: 16,
    width: 24,
    height: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  versionName: {
    fontSize: 14,
    fontWeight: 600,
    color: colors.white
  },
  versionStats: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  versionCount: {
    fontSize: 18,
    fontWeight: 700,
    color: colors.yellow
  },
  versionPercentage: {
    fontSize: 12,
    color: colors.grey,
    fontWeight: 500
  },
  versionProgress: {
    width: '100%',
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden' as const
  },
  versionProgressFill: {
    height: '100%',
    borderRadius: 2,
    transition: 'width 1.5s ease-in-out'
  },

  // Empty States
  emptyDevices: {
    padding: 40,
    textAlign: 'center' as const,
    background: colors.bg,
    borderRadius: 8,
    border: `2px dashed ${colors.border}`
  },
  emptyVersions: {
    padding: 40,
    textAlign: 'center' as const,
    background: colors.bg,
    borderRadius: 8,
    border: `2px dashed ${colors.border}`
  },
  emptyText: {
    fontSize: 14,
    color: colors.grey,
    margin: 0
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: 60,
    background: colors.greyhard,
    border: `2px dashed ${colors.border}`,
    borderRadius: 16
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
    opacity: 0.5
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: colors.grey,
    margin: '0 0 12px 0'
  },
  emptyDescription: {
    fontSize: 14,
    color: colors.grey,
    margin: 0,
    maxWidth: 400,
    marginLeft: 'auto',
    marginRight: 'auto',
    lineHeight: 1.5
  },

  // Loading States
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 24
  },
  loadingCard: {
    height: 300,
    backgroundColor: colors.greyhard,
    border: `2px solid ${colors.border}`,
    borderRadius: 16,
    padding: 24,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  loadingSkeleton: {
    width: '100%',
    height: '100%',
    background: `linear-gradient(90deg, ${colors.greyhard} 25%, ${colors.border} 50%, ${colors.greyhard} 75%)`,
    backgroundSize: '200% 100%',
    borderRadius: 12,
    animation: 'shimmer 2s infinite'
  }
}

export default MobileDeviceDistribution