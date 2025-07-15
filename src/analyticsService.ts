import { 
    logEvent, 
    setUserProperties, 
    setUserId,
    setCurrentScreen 
  } from 'firebase/analytics'
  import { 
    collection, 
    query, 
    where, 
    orderBy, 
    limit, 
    getDocs, 
    addDoc, 
    Timestamp,
    onSnapshot 
  } from 'firebase/firestore'
  import { analytics, db } from './firebase'
  
  // Types for analytics data
  export interface UserAnalytics {
    userId: string
    email: string
    lastLogin: Date
    totalSessions: number
    totalQuizzesTaken: number
    totalPointsEarned: number
    averageSessionDuration: number
    preferredLanguage: string
    deviceType: string
    createdAt: Date
  }
  
  export interface QuizAnalytics {
    quizId: string
    title: string
    completions: number
    averageScore: number
    averageTime: number
    successRate: number
    dropoffRate: number
    createdAt: Date
    lastCompleted?: Date
  }
  
  export interface SessionAnalytics {
    sessionId: string
    userId: string
    startTime: Date
    endTime?: Date
    duration?: number
    pagesViewed: string[]
    quizzesAttempted: string[]
    deviceInfo: {
      userAgent: string
      screenResolution: string
      language: string
    }
  }
  
  export interface RealtimeStats {
    activeUsers: number
    onlineUsers: string[]
    currentQuizSessions: number
    totalQuizzesToday: number
    averageSessionTime: number
  }
  
  class AnalyticsService {
    // User Analytics
    async trackUser(userId: string, userProperties: Partial<UserAnalytics>) {
      if (!analytics) return
  
      setUserId(analytics, userId)
      setUserProperties(analytics, userProperties)
  
      // Store in Firestore for detailed analytics
      try {
        await addDoc(collection(db, 'userAnalytics'), {
          ...userProperties,
          userId,
          timestamp: Timestamp.now()
        })
      } catch (error) {
        console.error('Error storing user analytics:', error)
      }
    }
  
    // Quiz Events
    async trackQuizStart(quizId: string, userId: string) {
      if (!analytics) return
  
      logEvent(analytics, 'quiz_start', {
        quiz_id: quizId,
        user_id: userId,
        timestamp: new Date().toISOString()
      })
  
      // Store detailed data
      await addDoc(collection(db, 'quizEvents'), {
        type: 'quiz_start',
        quizId,
        userId,
        timestamp: Timestamp.now()
      })
    }
  
    async trackQuizComplete(quizId: string, userId: string, score: number, timeSpent: number) {
      if (!analytics) return
  
      logEvent(analytics, 'quiz_complete', {
        quiz_id: quizId,
        user_id: userId,
        score,
        time_spent: timeSpent
      })
  
      await addDoc(collection(db, 'quizEvents'), {
        type: 'quiz_complete',
        quizId,
        userId,
        score,
        timeSpent,
        timestamp: Timestamp.now()
      })
    }
  
    async trackQuizAbandoned(quizId: string, userId: string, questionNumber: number) {
      if (!analytics) return
  
      logEvent(analytics, 'quiz_abandoned', {
        quiz_id: quizId,
        user_id: userId,
        question_number: questionNumber
      })
  
      await addDoc(collection(db, 'quizEvents'), {
        type: 'quiz_abandoned',
        quizId,
        userId,
        questionNumber,
        timestamp: Timestamp.now()
      })
    }
  
    // Page Views
    async trackPageView(pageName: string, userId?: string) {
      if (!analytics) return
  
      setCurrentScreen(analytics, pageName)
      logEvent(analytics, 'page_view', {
        page_name: pageName,
        user_id: userId
      })
    }
  
    // Session Tracking
    async startSession(userId: string, deviceInfo: SessionAnalytics['deviceInfo']) {
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      const sessionData: Omit<SessionAnalytics, 'endTime' | 'duration'> = {
        sessionId,
        userId,
        startTime: new Date(),
        pagesViewed: [],
        quizzesAttempted: [],
        deviceInfo
      }
  
      await addDoc(collection(db, 'sessions'), {
        ...sessionData,
        startTime: Timestamp.fromDate(sessionData.startTime)
      })
  
      return sessionId
    }
  
    async endSession(sessionId: string, pagesViewed: string[], quizzesAttempted: string[]) {
      // In a real app, you'd update the existing session document
      const endTime = new Date()
      
      await addDoc(collection(db, 'sessionEnds'), {
        sessionId,
        endTime: Timestamp.fromDate(endTime),
        pagesViewed,
        quizzesAttempted
      })
    }
  
    // Data Retrieval Methods
    async getUserAnalytics(userId: string): Promise<UserAnalytics[]> {
      const q = query(
        collection(db, 'userAnalytics'),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(100)
      )
  
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        ...doc.data() as UserAnalytics,
        createdAt: doc.data().timestamp?.toDate() || new Date()
      }))
    }
  
    async getQuizAnalytics(quizId?: string): Promise<QuizAnalytics[]> {
      let q = query(
        collection(db, 'quizEvents'),
        orderBy('timestamp', 'desc'),
        limit(1000)
      )
  
      if (quizId) {
        q = query(
          collection(db, 'quizEvents'),
          where('quizId', '==', quizId),
          orderBy('timestamp', 'desc'),
          limit(1000)
        )
      }
  
      const querySnapshot = await getDocs(q)
      const events = querySnapshot.docs.map(doc => doc.data())
  
      // Process events into analytics
      const quizStats = new Map<string, any>()
  
      events.forEach(event => {
        const { quizId: eventQuizId, type, score, timeSpent } = event
        
        if (!quizStats.has(eventQuizId)) {
          quizStats.set(eventQuizId, {
            quizId: eventQuizId,
            title: `Quiz ${eventQuizId}`, // You'd get this from your quiz data
            completions: 0,
            totalScore: 0,
            totalTime: 0,
            attempts: 0,
            abandons: 0,
            createdAt: event.timestamp?.toDate() || new Date()
          })
        }
  
        const stats = quizStats.get(eventQuizId)
  
        if (type === 'quiz_complete') {
          stats.completions++
          stats.totalScore += score || 0
          stats.totalTime += timeSpent || 0
        } else if (type === 'quiz_start') {
          stats.attempts++
        } else if (type === 'quiz_abandoned') {
          stats.abandons++
        }
      })
  
      return Array.from(quizStats.values()).map(stats => ({
        ...stats,
        averageScore: stats.completions > 0 ? stats.totalScore / stats.completions : 0,
        averageTime: stats.completions > 0 ? stats.totalTime / stats.completions : 0,
        successRate: stats.attempts > 0 ? (stats.completions / stats.attempts) * 100 : 0,
        dropoffRate: stats.attempts > 0 ? (stats.abandons / stats.attempts) * 100 : 0
      }))
    }
  
    async getSessionAnalytics(days: number = 30): Promise<SessionAnalytics[]> {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)
  
      const q = query(
        collection(db, 'sessions'),
        where('startTime', '>=', Timestamp.fromDate(startDate)),
        orderBy('startTime', 'desc'),
        limit(1000)
      )
  
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        ...doc.data() as SessionAnalytics,
        startTime: doc.data().startTime?.toDate() || new Date()
      }))
    }
  
    // Real-time Analytics
    subscribeToRealtimeStats(callback: (stats: RealtimeStats) => void) {
      const unsubscribe = onSnapshot(
        query(
          collection(db, 'realtimeStats'),
          orderBy('timestamp', 'desc'),
          limit(1)
        ),
        (snapshot) => {
          if (!snapshot.empty) {
            const data = snapshot.docs[0].data()
            callback(data as RealtimeStats)
          }
        },
        (error) => {
          console.error('Error subscribing to realtime stats:', error)
        }
      )
  
      return unsubscribe
    }
  
    // Custom Events
    async trackCustomEvent(eventName: string, parameters: Record<string, any>) {
      if (!analytics) return
  
      logEvent(analytics, eventName, parameters)
  
      await addDoc(collection(db, 'customEvents'), {
        eventName,
        parameters,
        timestamp: Timestamp.now()
      })
    }
  
    // Performance Metrics
    async trackPerformance(metric: string, value: number, additionalData?: Record<string, any>) {
      await addDoc(collection(db, 'performanceMetrics'), {
        metric,
        value,
        additionalData,
        timestamp: Timestamp.now()
      })
    }
  
    // Error Tracking
    async trackError(error: Error, context?: string, userId?: string) {
      await addDoc(collection(db, 'errorLogs'), {
        message: error.message,
        stack: error.stack,
        context,
        userId,
        timestamp: Timestamp.now()
      })
    }
  }
  
  export const analyticsService = new AnalyticsService()
  export default analyticsService