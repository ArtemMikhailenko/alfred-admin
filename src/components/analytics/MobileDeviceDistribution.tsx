import React from 'react'
import styles from './MobileDeviceDistribution.module.css'

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
        <div className={styles.emptyDevices}>
          <p>No device data available</p>
        </div>
      )
    }

    return (
      <div className={styles.deviceList}>
        {devices.slice(0, 8).map(([device, count], index) => (
          <div key={device} className={styles.deviceItem}>
            <div className={styles.deviceInfo}>
              <span className={styles.deviceIcon}>{getDeviceIcon(device)}</span>
              <div className={styles.deviceDetails}>
                <span className={styles.deviceName}>{device}</span>
                <span className={styles.deviceCount}>{count} users</span>
              </div>
            </div>
            <div className={styles.deviceStats}>
              <div className={styles.devicePercentage}>
                {formatPercentage(count, total)}
              </div>
              <div className={styles.deviceBar}>
                <div 
                  className={styles.deviceBarFill}
                  style={{ 
                    width: `${(count / total) * 100}%`,
                    backgroundColor: platform === 'android' ? 'var(--green)' : 'var(--blue)'
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
        <div className={styles.emptyVersions}>
          <p>No OS version data available</p>
        </div>
      )
    }

    return (
      <div className={styles.versionGrid}>
        {versions.slice(0, 6).map(([version, count], index) => (
          <div key={version} className={styles.versionCard}>
            <div className={styles.versionHeader}>
              <span className={styles.versionIcon}>{getOSIcon(platform)}</span>
              <span className={styles.versionName}>{version}</span>
            </div>
            <div className={styles.versionStats}>
              <div className={styles.versionCount}>{count}</div>
              <div className={styles.versionPercentage}>
                {formatPercentage(count, total)}
              </div>
            </div>
            <div className={styles.versionProgress}>
              <div 
                className={styles.versionProgressFill}
                style={{ 
                  width: `${(count / total) * 100}%`,
                  backgroundColor: platform === 'android' ? 'var(--green)' : 'var(--blue)'
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
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>Device & OS Distribution</h3>
          <p className={styles.subtitle}>Loading device analytics...</p>
        </div>
        <div className={styles.loadingGrid}>
          {[1, 2].map(i => (
            <div key={i} className={styles.loadingCard}>
              <div className={styles.loadingSkeleton} />
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
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Device & OS Distribution</h3>
        <p className={styles.subtitle}>
          Device models and operating system versions breakdown
        </p>
      </div>

      {/* Platform Overview */}
      <div className={styles.platformOverview}>
        <div className={styles.platformCard}>
          <div className={styles.platformHeader}>
            <span className={styles.platformIcon}>🤖</span>
            <span className={styles.platformName}>Android</span>
          </div>
          <div className={styles.platformStats}>
            <div className={styles.platformCount}>{data.android.total}</div>
            <div className={styles.platformPercentage}>{androidPercentage.toFixed(1)}%</div>
          </div>
        </div>

        <div className={styles.platformCard}>
          <div className={styles.platformHeader}>
            <span className={styles.platformIcon}>🍎</span>
            <span className={styles.platformName}>iOS</span>
          </div>
          <div className={styles.platformStats}>
            <div className={styles.platformCount}>{data.ios.total}</div>
            <div className={styles.platformPercentage}>{iosPercentage.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Device Distribution */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Top Devices</h4>
        <div className={styles.devicesGrid}>
          <div className={styles.deviceSection}>
            <div className={styles.deviceSectionHeader}>
              <span className={styles.deviceSectionIcon}>🤖</span>
              <span className={styles.deviceSectionTitle}>Android Devices</span>
              <span className={styles.deviceSectionCount}>({data.android.total} users)</span>
            </div>
            {renderDeviceList(data.android.topDevices, data.android.total, 'android')}
          </div>

          <div className={styles.deviceSection}>
            <div className={styles.deviceSectionHeader}>
              <span className={styles.deviceSectionIcon}>🍎</span>
              <span className={styles.deviceSectionTitle}>iOS Devices</span>
              <span className={styles.deviceSectionCount}>({data.ios.total} users)</span>
            </div>
            {renderDeviceList(data.ios.topDevices, data.ios.total, 'ios')}
          </div>
        </div>
      </div>

      {/* OS Versions */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>OS Versions</h4>
        <div className={styles.versionsGrid}>
          <div className={styles.versionSection}>
            <div className={styles.versionSectionHeader}>
              <span className={styles.versionSectionIcon}>🤖</span>
              <span className={styles.versionSectionTitle}>Android Versions</span>
            </div>
            {renderOSVersions(data.android.osVersions, data.android.total, 'android')}
          </div>

          <div className={styles.versionSection}>
            <div className={styles.versionSectionHeader}>
              <span className={styles.versionSectionIcon}>🍎</span>
              <span className={styles.versionSectionTitle}>iOS Versions</span>
            </div>
            {renderOSVersions(data.ios.osVersions, data.ios.total, 'ios')}
          </div>
        </div>
      </div>

      {totalUsers === 0 && !loading && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📱</div>
          <h4 className={styles.emptyTitle}>No Device Data</h4>
          <p className={styles.emptyDescription}>
            Device distribution data will appear here once mobile users start using your apps.
          </p>
        </div>
      )}
    </div>
  )
}

export default MobileDeviceDistribution