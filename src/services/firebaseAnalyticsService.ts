const API_BASE_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:3007'

export interface FirebaseAnalyticsOverview {
  totalUsers: number
  activeUsers: number
  sessions: number
  screenViews: number
  newUsers: number
  averageSessionDuration: number
  bounceRate: number
}

export interface FirebaseEvent {
  name: string
  count: number
}

export interface TopScreen {
  screenName: string
  views: number
}

export interface FirebaseAnalyticsResponse {
  overview: FirebaseAnalyticsOverview
  events: FirebaseEvent[]
  topScreens: TopScreen[]
  period: {
    startDate: string
    endDate: string
  }
  isDemo: boolean
}

class FirebaseAnalyticsService {
  async getAnalytics(startDate: string, endDate: string, accessToken: string): Promise<FirebaseAnalyticsResponse> {
    try {
      const url = `${API_BASE_URL}/analytics?startDate=${startDate}&endDate=${endDate}`
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching Firebase analytics:', error)
      throw error
    }
  }

  formatTimeRange(timeRange: '7d' | '30d' | '90d' | '1y'): { startDate: string, endDate: string } {
    const endDate = new Date()
    const startDate = new Date()

    switch (timeRange) {
      case '7d':
        startDate.setDate(endDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(endDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(endDate.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(endDate.getFullYear() - 1)
        break
    }

    return {
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0]
    }
  }

  formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }
}

export const firebaseAnalyticsService = new FirebaseAnalyticsService()