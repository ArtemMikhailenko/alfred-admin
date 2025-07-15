import { 
    collection, 
    query, 
    where, 
    orderBy, 
    limit, 
    getDocs, 
    Timestamp,
    onSnapshot,
    doc,
    getDoc 
  } from 'firebase/firestore'
  import { db } from './firebase'
  
  // Types for mobile app analytics
  export interface MobileAppAnalytics {
    appId: string
    appName: string
    platform: 'android' | 'ios'
    bundleId: string
    totalUsers: number
    activeUsers: number
    dailyActiveUsers: number
    monthlyActiveUsers: number
    sessionCount: number
    averageSessionDuration: number
    crashFreeRate: number
    appVersion: string
    lastUpdate: Date
  }
  
  export interface MobileUserSession {
    sessionId: string
    userId: string
    appId: string
    platform: 'android' | 'ios'
    appVersion: string
    deviceModel: string
    osVersion: string
    country: string
    language: string
    startTime: Date
    duration: number
    screenViews: string[]
    events: MobileEvent[]
    crashed: boolean
  }
  
  export interface MobileEvent {
    eventName: string
    parameters: Record<string, any>
    timestamp: Date
    screenName?: string
    userId?: string
  }
  
  export interface MobileQuizAnalytics {
    quizId: string
    appId: string
    platform: 'android' | 'ios'
    completions: number
    attempts: number
    averageScore: number
    averageTimeMs: number
    completionRate: number
    dropOffPoints: Record<string, number>
    popularityRank: number
    lastPlayed: Date
  }
  
  export interface MobileCrashReport {
    crashId: string
    appId: string
    platform: 'android' | 'ios'
    appVersion: string
    deviceModel: string
    osVersion: string
    stackTrace: string
    userId?: string
    timestamp: Date
    resolved: boolean
  }
  
  export interface MobilePerformanceMetrics {
    appId: string
    platform: 'android' | 'ios'
    appStartTime: number
    screenLoadTime: Record<string, number>
    networkLatency: number
    memoryUsage: number
    cpuUsage: number
    batteryUsage: number
    timestamp: Date
  }
  
  class MobileAnalyticsService {
    // App Overview Analytics
    async getMobileAppsOverview(): Promise<MobileAppAnalytics[]> {
      try {
        const apps = [
          {
            appId: '1:357456234670:android:4b376afa927b130dfb853f',
            appName: 'AlfredTrade Android',
            platform: 'android' as const,
            bundleId: 'com.alfredtrade'
          },
          {
            appId: '1:357456234670:ios:58776da911cc98b5fb853f',
            appName: 'AlfredTrade iOS',
            platform: 'ios' as const,
            bundleId: 'alfred-trade.com.alfredtrade'
          }
        ]
  
        const analyticsPromises = apps.map(async (app) => {
          const analytics = await this.getAppAnalytics(app.appId, app.platform)
          return {
            ...app,
            ...analytics
          }
        })
  
        return await Promise.all(analyticsPromises)
      } catch (error) {
        console.error('Error fetching mobile apps overview:', error)
        return []
      }
    }
  
    private async getAppAnalytics(appId: string, platform: 'android' | 'ios') {
      try {
        // Получаем агрегированные данные из Firestore
        const analyticsDoc = await getDoc(doc(db, 'mobileAppsAnalytics', appId))
        
        if (analyticsDoc.exists()) {
          const data = analyticsDoc.data()
          return {
            totalUsers: data.totalUsers || 0,
            activeUsers: data.activeUsers || 0,
            dailyActiveUsers: data.dailyActiveUsers || 0,
            monthlyActiveUsers: data.monthlyActiveUsers || 0,
            sessionCount: data.sessionCount || 0,
            averageSessionDuration: data.averageSessionDuration || 0,
            crashFreeRate: data.crashFreeRate || 100,
            appVersion: data.appVersion || '1.0.0',
            lastUpdate: data.lastUpdate?.toDate() || new Date()
          }
        }
  
        // Если нет агрегированных данных, вычисляем из сырых данных
        return await this.calculateAnalyticsFromRawData(appId, platform)
      } catch (error) {
        console.error(`Error getting analytics for ${appId}:`, error)
        return {
          totalUsers: 0,
          activeUsers: 0,
          dailyActiveUsers: 0,
          monthlyActiveUsers: 0,
          sessionCount: 0,
          averageSessionDuration: 0,
          crashFreeRate: 100,
          appVersion: '1.0.0',
          lastUpdate: new Date()
        }
      }
    }
  
    private async calculateAnalyticsFromRawData(appId: string, platform: 'android' | 'ios') {
      try {
        const now = new Date()
        const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
  
        // Получаем сессии за последний месяц
        const sessionsQuery = query(
          collection(db, 'mobileSessions'),
          where('appId', '==', appId),
          where('startTime', '>=', Timestamp.fromDate(monthAgo)),
          orderBy('startTime', 'desc'),
          limit(10000)
        )
  
        const sessionsSnapshot = await getDocs(sessionsQuery)
        //@ts-ignore
        const sessions = sessionsSnapshot.docs.map(doc => ({
          ...doc.data(),
          startTime: doc.data().startTime?.toDate() || new Date()
        })) as MobileUserSession[]
  
        // Вычисляем метрики
        const uniqueUsers = new Set(sessions.map(s => s.userId)).size
        const dailySessions = sessions.filter(s => s.startTime >= dayAgo)
        const dailyActiveUsers = new Set(dailySessions.map(s => s.userId)).size
        
        const totalDuration = sessions.reduce((sum, s) => sum + (s.duration || 0), 0)
        const averageSessionDuration = sessions.length > 0 ? totalDuration / sessions.length : 0
  
        // Получаем данные о крашах
        const crashesQuery = query(
          collection(db, 'mobileCrashes'),
          where('appId', '==', appId),
          where('timestamp', '>=', Timestamp.fromDate(monthAgo))
        )
        
        const crashesSnapshot = await getDocs(crashesQuery)
        const crashes = crashesSnapshot.docs.length
        const crashFreeRate = sessions.length > 0 ? ((sessions.length - crashes) / sessions.length) * 100 : 100
  
        return {
          totalUsers: uniqueUsers,
          activeUsers: dailyActiveUsers,
          dailyActiveUsers: dailyActiveUsers,
          monthlyActiveUsers: uniqueUsers,
          sessionCount: sessions.length,
          averageSessionDuration: Math.round(averageSessionDuration),
          crashFreeRate: Math.round(crashFreeRate * 100) / 100,
          appVersion: sessions[0]?.appVersion || '1.0.0',
          lastUpdate: new Date()
        }
      } catch (error) {
        console.error('Error calculating analytics from raw data:', error)
        return {
          totalUsers: 0,
          activeUsers: 0,
          dailyActiveUsers: 0,
          monthlyActiveUsers: 0,
          sessionCount: 0,
          averageSessionDuration: 0,
          crashFreeRate: 100,
          appVersion: '1.0.0',
          lastUpdate: new Date()
        }
      }
    }
  
    // Mobile Sessions Analytics
    async getMobileSessions(appId?: string, days: number = 30): Promise<MobileUserSession[]> {
      try {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
  
        let sessionsQuery = query(
          collection(db, 'mobileSessions'),
          where('startTime', '>=', Timestamp.fromDate(startDate)),
          orderBy('startTime', 'desc'),
          limit(1000)
        )
  
        if (appId) {
          sessionsQuery = query(
            collection(db, 'mobileSessions'),
            where('appId', '==', appId),
            where('startTime', '>=', Timestamp.fromDate(startDate)),
            orderBy('startTime', 'desc'),
            limit(1000)
          )
        }
  
        const snapshot = await getDocs(sessionsQuery)
                //@ts-ignore

        return snapshot.docs.map(doc => ({
          ...doc.data(),
          startTime: doc.data().startTime?.toDate() || new Date()
        })) as MobileUserSession[]
      } catch (error) {
        console.error('Error fetching mobile sessions:', error)
        return []
      }
    }
  
    // Mobile Quiz Analytics
    async getMobileQuizAnalytics(days: number = 30): Promise<MobileQuizAnalytics[]> {
      try {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
  
        const eventsQuery = query(
          collection(db, 'mobileEvents'),
          where('eventName', 'in', ['quiz_start', 'quiz_complete', 'quiz_abandoned']),
          where('timestamp', '>=', Timestamp.fromDate(startDate)),
          orderBy('timestamp', 'desc'),
          limit(5000)
        )
  
        const snapshot = await getDocs(eventsQuery)
                //@ts-ignore

        const events = snapshot.docs.map(doc => ({
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as MobileEvent[]
  
        // Группируем события по quiz_id и platform
        const quizStats = new Map<string, any>()
  
        events.forEach(event => {
          const quizId = event.parameters?.quiz_id
          const appId = event.parameters?.app_id
          const platform = event.parameters?.platform
          
          if (!quizId || !appId || !platform) return
  
          const key = `${quizId}_${platform}`
          
          if (!quizStats.has(key)) {
            quizStats.set(key, {
              quizId,
              appId,
              platform,
              attempts: 0,
              completions: 0,
              totalScore: 0,
              totalTime: 0,
              abandons: 0,
              lastPlayed: event.timestamp
            })
          }
  
          const stats = quizStats.get(key)
  
          switch (event.eventName) {
            case 'quiz_start':
              stats.attempts++
              break
            case 'quiz_complete':
              stats.completions++
              stats.totalScore += event.parameters?.score || 0
              stats.totalTime += event.parameters?.time_spent || 0
              break
            case 'quiz_abandoned':
              stats.abandons++
              break
          }
  
          if (event.timestamp > stats.lastPlayed) {
            stats.lastPlayed = event.timestamp
          }
        })
  
        return Array.from(quizStats.values()).map(stats => ({
          ...stats,
          averageScore: stats.completions > 0 ? stats.totalScore / stats.completions : 0,
          averageTimeMs: stats.completions > 0 ? stats.totalTime / stats.completions : 0,
          completionRate: stats.attempts > 0 ? (stats.completions / stats.attempts) * 100 : 0,
          dropOffPoints: {}, // TODO: вычислить точки отказа
          popularityRank: 0 // TODO: вычислить рейтинг популярности
        }))
      } catch (error) {
        console.error('Error fetching mobile quiz analytics:', error)
        return []
      }
    }
  
    // Crash Reports
    async getMobileCrashReports(appId?: string, days: number = 30): Promise<MobileCrashReport[]> {
      try {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
  
        let crashQuery = query(
          collection(db, 'mobileCrashes'),
          where('timestamp', '>=', Timestamp.fromDate(startDate)),
          orderBy('timestamp', 'desc'),
          limit(100)
        )
  
        if (appId) {
          crashQuery = query(
            collection(db, 'mobileCrashes'),
            where('appId', '==', appId),
            where('timestamp', '>=', Timestamp.fromDate(startDate)),
            orderBy('timestamp', 'desc'),
            limit(100)
          )
        }
  
        const snapshot = await getDocs(crashQuery)
                //@ts-ignore

        return snapshot.docs.map(doc => ({
          crashId: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as MobileCrashReport[]
      } catch (error) {
        console.error('Error fetching crash reports:', error)
        return []
      }
    }
  
    // Performance Metrics
    async getMobilePerformanceMetrics(appId?: string, days: number = 7): Promise<MobilePerformanceMetrics[]> {
      try {
        const startDate = new Date()
        startDate.setDate(startDate.getDate() - days)
  
        let performanceQuery = query(
          collection(db, 'mobilePerformance'),
          where('timestamp', '>=', Timestamp.fromDate(startDate)),
          orderBy('timestamp', 'desc'),
          limit(1000)
        )
  
        if (appId) {
          performanceQuery = query(
            collection(db, 'mobilePerformance'),
            where('appId', '==', appId),
            where('timestamp', '>=', Timestamp.fromDate(startDate)),
            orderBy('timestamp', 'desc'),
            limit(1000)
          )
        }
  
        const snapshot = await getDocs(performanceQuery)
                //@ts-ignore

        return snapshot.docs.map(doc => ({
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate() || new Date()
        })) as MobilePerformanceMetrics[]
      } catch (error) {
        console.error('Error fetching performance metrics:', error)
        return []
      }
    }
  
    // Real-time Mobile Stats
    subscribeMobileRealtimeStats(callback: (stats: any) => void) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'mobileRealtimeStats'),
          orderBy('timestamp', 'desc'),
          limit(1)
        ),
                //@ts-ignore

        (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs[0].data()
            callback({
              androidActiveUsers: data.androidActiveUsers || 0,
              iosActiveUsers: data.iosActiveUsers || 0,
              totalMobileUsers: data.totalMobileUsers || 0,
              currentQuizSessions: data.currentQuizSessions || 0,
              crashReportsToday: data.crashReportsToday || 0,
              lastUpdate: data.timestamp?.toDate() || new Date()
            })
          }
        },
        (error) => {
          console.error('Error subscribing to mobile realtime stats:', error)
        }
      )
  
      return unsubscribe
    }
  
    // Device and OS Distribution
    async getDeviceDistribution(days: number = 30): Promise<Record<string, any>> {
      try {
        const sessions = await this.getMobileSessions(undefined, days)
        
        const deviceStats = {
          android: {
            total: 0,
            devices: new Map<string, number>(),
            osVersions: new Map<string, number>()
          },
          ios: {
            total: 0,
            devices: new Map<string, number>(),
            osVersions: new Map<string, number>()
          }
        }
  
        sessions.forEach(session => {
          const platform = session.platform
          deviceStats[platform].total++
          
          // Device models
          const deviceCount = deviceStats[platform].devices.get(session.deviceModel) || 0
          deviceStats[platform].devices.set(session.deviceModel, deviceCount + 1)
          
          // OS versions
          const osCount = deviceStats[platform].osVersions.get(session.osVersion) || 0
          deviceStats[platform].osVersions.set(session.osVersion, osCount + 1)
        })
  
        return {
          android: {
            total: deviceStats.android.total,
            topDevices: Array.from(deviceStats.android.devices.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10),
            osVersions: Array.from(deviceStats.android.osVersions.entries())
              .sort((a, b) => b[1] - a[1])
          },
          ios: {
            total: deviceStats.ios.total,
            topDevices: Array.from(deviceStats.ios.devices.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 10),
            osVersions: Array.from(deviceStats.ios.osVersions.entries())
              .sort((a, b) => b[1] - a[1])
          }
        }
      } catch (error) {
        console.error('Error getting device distribution:', error)
        return { android: { total: 0, topDevices: [], osVersions: [] }, ios: { total: 0, topDevices: [], osVersions: [] } }
      }
    }
  
    // Geographic Distribution
    async getGeographicDistribution(days: number = 30): Promise<Record<string, number>> {
      try {
        const sessions = await this.getMobileSessions(undefined, days)
        const countryStats = new Map<string, number>()
  
        sessions.forEach(session => {
          const country = session.country || 'Unknown'
          const count = countryStats.get(country) || 0
          countryStats.set(country, count + 1)
        })
  
        return Object.fromEntries(
          Array.from(countryStats.entries()).sort((a, b) => b[1] - a[1])
        )
      } catch (error) {
        console.error('Error getting geographic distribution:', error)
        return {}
      }
    }
  }
  
  export const mobileAnalyticsService = new MobileAnalyticsService()
  export default mobileAnalyticsService