import { initializeApp } from 'firebase/app'
import { getAnalytics, Analytics } from 'firebase/analytics'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getAuth, Auth } from 'firebase/auth'

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
let analytics: Analytics | null = null
let db: Firestore
let auth: Auth

try {
  // Analytics only works in browser environment
  if (typeof window !== 'undefined') {
    analytics = getAnalytics(app)
  }
  db = getFirestore(app)
  auth = getAuth(app)
} catch (error) {
  console.error('Error initializing Firebase services:', error)
  throw error
}

export { analytics, db, auth }
export default app