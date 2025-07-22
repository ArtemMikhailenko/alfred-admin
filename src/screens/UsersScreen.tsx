import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { RootState } from '../redux'
import { clearTokens } from '../redux/tokens'
import { AdminRegister, GetAllUsers } from '../actions/actions'
import { ReloginAndRetry } from '../components/ReloginAndRetry'
import colors from '../constants/colors'
import globalStyles from '../constants/globalStyles'
import { Language } from '../constants/interfaces'
import LanguageSelectorBlock from '../components/LanguageSelectorBlock'

interface User {
  id: string | number
  email: string
  role?: 'admin' | 'user' // Made optional since it might be undefined
  createdAt: string
  isActive?: boolean // Made optional since it might be undefined
  lastLogin?: string
  isVerified?: boolean
  subscriptionActive?: boolean
  referralCode?: string
  referralPoints?: number
  referredUsersCount?: number
  rank?: number
  completedLessons?: any[]
  lastCompletedLessonDate?: string
}

interface UsersScreenProps {
  searchTerm: string
  onSearchChange: (term: string) => void
  language: Language
  onLanguageChange: (lang: Language) => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

const UsersScreen: React.FC<UsersScreenProps> = ({
  searchTerm,
  language,
  onLanguageChange,
  viewMode,
}) => {
  const tokens = useSelector((state: RootState) => state.tokens)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPassword, setNewAdminPassword] = useState('')
  const [creating, setCreating] = useState(false)

  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAdmins: 0,
    totalAdmins: 0,
    newUsersThisMonth: 0,
  })

  function LogOut() {
    localStorage.clear()
    dispatch(clearTokens())
    navigate('/login')
  }

  const fetchUsers = async () => {
    if (!tokens.accessToken || !tokens.email) {
      LogOut()
      return
    }

    setLoading(true)
    try {
      const tryFetch = async (accessToken: string): Promise<boolean> => {
        const response = await GetAllUsers(accessToken)
        if (response.error && response.statusCode === 401) {
          return false
        }

        if (response.users) {
          setUsers(response.users)
          
          // Calculate stats with safe property access
          const totalUsers = response.users.length
          const totalAdmins = response.users.filter((u: User) => u.role === 'admin').length
          const activeAdmins = response.users.filter((u: User) => u.role === 'admin' && u.isActive !== false).length
          
          // Calculate new users this month
          const currentDate = new Date()
          const currentMonth = currentDate.getMonth()
          const currentYear = currentDate.getFullYear()
          const newUsersThisMonth = response.users.filter((u: User) => {
            if (!u.createdAt) return false
            const createdDate = new Date(u.createdAt)
            return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear
          }).length

          setStats({
            totalUsers,
            activeAdmins,
            totalAdmins,
            newUsersThisMonth,
          })
        }
        return true
      }

      const success = await tryFetch(tokens.accessToken)
      if (!success) {
        await ReloginAndRetry(tokens.email, dispatch, tryFetch)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [tokens.accessToken])

  const handleCreateAdmin = async () => {
    if (!tokens.accessToken || !tokens.email) {
      LogOut()
      return
    }

    if (!newAdminEmail.trim() || !newAdminPassword.trim()) {
      alert('Please fill in all fields')
      return
    }

    setCreating(true)
    try {
      const tryCreate = async (accessToken: string): Promise<boolean> => {
        const response = await AdminRegister(newAdminEmail, newAdminPassword, accessToken)
        if (response.error && response.statusCode === 401) {
          return false
        }

        if (response.error) {
          alert(response.error)
          return true // Don't retry on validation errors
        }

        setNewAdminEmail('')
        setNewAdminPassword('')
        setShowCreateModal(false)
        await fetchUsers()
        return true
      }

      const success = await tryCreate(tokens.accessToken)
      if (!success) {
        await ReloginAndRetry(tokens.email, dispatch, tryCreate)
      }
    } catch (error) {
      console.error('Error creating admin:', error)
      alert('Error creating admin')
    } finally {
      setCreating(false)
    }
  }

  const filteredUsers = users.filter((user) =>
    user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  const formatDateTime = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch (error) {
      return 'Invalid Date'
    }
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <h1 style={styles.title}>Users Management</h1>
          <p style={styles.subtitle}>Manage administrators and view user statistics</p>
        </div>
        <div style={styles.headerRight}>
          <LanguageSelectorBlock language={language} setLanguage={onLanguageChange} />
          <button
            onClick={() => setShowCreateModal(true)}
            style={styles.primaryButton}
            disabled={creating}
          >
            {creating ? 'Creating...' : 'Add Admin'}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>👥</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.totalUsers}</h3>
            <p style={styles.statLabel}>Total Users</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔐</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.totalAdmins}</h3>
            <p style={styles.statLabel}>Total Admins</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>✅</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.activeAdmins}</h3>
            <p style={styles.statLabel}>Active Admins</p>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>📈</div>
          <div style={styles.statContent}>
            <h3 style={styles.statNumber}>{stats.newUsersThisMonth}</h3>
            <p style={styles.statLabel}>New This Month</p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h2 style={styles.sectionTitle}>Users List</h2>
          <div style={styles.tableActions}>
            <span style={styles.resultCount}>
              {filteredUsers.length} of {users.length} users
            </span>
          </div>
        </div>

        {loading ? (
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner} />
            <p style={styles.loadingText}>Loading users...</p>
          </div>
        ) : (
          <div style={styles.table}>
            <div style={styles.tableHeaderRow}>
              <div style={styles.tableHeaderCell}>User</div>
              <div style={styles.tableHeaderCell}>Role</div>
              <div style={styles.tableHeaderCell}>Status</div>
              <div style={styles.tableHeaderCell}>Created</div>
              <div style={styles.tableHeaderCell}>Last Login</div>
            </div>
            
            {filteredUsers.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyIcon}>👤</div>
                <h3 style={styles.emptyTitle}>No users found</h3>
                <p style={styles.emptyText}>
                  {searchTerm ? 'Try adjusting your search term' : 'No users have been created yet'}
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => {
                // Safe role handling with fallback
                const userRole = user.role || 'user'
                const isActive = user.isActive !== false // Default to true if undefined
                
                return (
                  <div key={user.id} style={styles.tableRow}>
                    <div style={styles.tableCell}>
                      <div style={styles.userInfo}>
                        <div 
                          style={{
                            ...styles.userAvatar,
                            backgroundColor: userRole === 'admin' ? colors.yellow : colors.grey,
                          }}
                        >
                          {user.email ? user.email.charAt(0).toUpperCase() : '?'}
                        </div>
                        <div style={styles.userDetails}>
                          <div style={styles.userEmail}>{user.email || 'No email'}</div>
                          <div style={styles.userId}>ID: {user.id}</div>
                        </div>
                      </div>
                    </div>
                    <div style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.roleBadge,
                          backgroundColor: userRole === 'admin' ? colors.yellow : colors.grey,
                          color: userRole === 'admin' ? colors.black : colors.white,
                        }}
                      >
                        {userRole.toUpperCase()}
                      </span>
                    </div>
                    <div style={styles.tableCell}>
                      <span
                        style={{
                          ...styles.statusBadge,
                          backgroundColor: isActive ? colors.green : colors.red,
                        }}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <div style={styles.tableCell}>
                      <span style={styles.dateText}>{formatDate(user.createdAt)}</span>
                    </div>
                    <div style={styles.tableCell}>
                      <span style={styles.dateText}>
                        {user.lastLogin ? formatDateTime(user.lastLogin) : 'Never'}
                      </span>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Create Admin Modal */}
      {showCreateModal && (
        <div style={styles.modalOverlay} onClick={() => !creating && setShowCreateModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Create New Admin</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                style={styles.closeButton}
                disabled={creating}
              >
                ×
              </button>
            </div>
            
            <div style={styles.modalBody}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Email Address</label>
                <input
                  type="email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  style={styles.formInput}
                  placeholder="admin@example.com"
                  disabled={creating}
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Password</label>
                <input
                  type="password"
                  value={newAdminPassword}
                  onChange={(e) => setNewAdminPassword(e.target.value)}
                  style={styles.formInput}
                  placeholder="Enter secure password"
                  disabled={creating}
                />
              </div>
            </div>
            
            <div style={styles.modalFooter}>
              <button
                onClick={() => setShowCreateModal(false)}
                style={styles.secondaryButton}
                disabled={creating}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAdmin}
                style={{
                  ...styles.primaryButton,
                  opacity: creating ? 0.6 : 1,
                }}
                disabled={creating}
              >
                {creating ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '24px',
    backgroundColor: colors.bg,
    minHeight: '100vh',
    color: colors.white,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: colors.white,
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: colors.grey,
    margin: 0,
  },
  primaryButton: {
    backgroundColor: colors.yellow,
    color: colors.black,
    border: 'none',
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    color: colors.grey,
    border: `1px solid ${colors.border}`,
    borderRadius: '8px',
    padding: '12px 24px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: '20px',
    marginBottom: '32px',
  },
  statCard: {
    backgroundColor: colors.greyhard,
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    border: `1px solid ${colors.border}`,
  },
  statIcon: {
    fontSize: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    backgroundColor: colors.bg,
  },
  statContent: {
    flex: 1,
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: colors.white,
    margin: '0 0 4px 0',
  },
  statLabel: {
    fontSize: '14px',
    color: colors.grey,
    margin: 0,
  },
  tableContainer: {
    backgroundColor: colors.greyhard,
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 24px',
    borderBottom: `1px solid ${colors.border}`,
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.white,
    margin: 0,
  },
  tableActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  resultCount: {
    fontSize: '14px',
    color: colors.grey,
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
  },
  tableHeaderRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
    padding: '16px 24px',
    backgroundColor: colors.bg,
    borderBottom: `1px solid ${colors.border}`,
    fontSize: '12px',
    fontWeight: '600',
    color: colors.grey,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  tableHeaderCell: {
    display: 'flex',
    alignItems: 'center',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr',
    padding: '16px 24px',
    borderBottom: `1px solid ${colors.border}`,
    transition: 'backgroundColor 0.2s ease',
    cursor: 'pointer',
  },
  tableCell: {
    display: 'flex',
    alignItems: 'center',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '14px',
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
  },
  userEmail: {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.white,
  },
  userId: {
    fontSize: '12px',
    color: colors.grey,
  },
  roleBadge: {
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
    letterSpacing: '0.5px',
  },
  statusBadge: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '11px',
    fontWeight: '500',
    color: colors.white,
  },
  dateText: {
    fontSize: '14px',
    color: colors.grey,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px',
    gap: '16px',
  },
  loadingSpinner: {
    width: '32px',
    height: '32px',
    border: `3px solid ${colors.border}`,
    borderTop: `3px solid ${colors.yellow}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: colors.grey,
    fontSize: '16px',
    margin: 0,
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '64px',
    textAlign: 'center',
  },
  emptyIcon: {
    fontSize: '48px',
    marginBottom: '16px',
    opacity: 0.5,
  },
  emptyTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.white,
    margin: '0 0 8px 0',
  },
  emptyText: {
    fontSize: '16px',
    color: colors.grey,
    margin: 0,
    maxWidth: '400px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: colors.greyhard,
    borderRadius: '16px',
    border: `1px solid ${colors.border}`,
    maxWidth: '480px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '24px 24px 0 24px',
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.white,
    margin: 0,
  },
  closeButton: {
    background: 'none',
    border: 'none',
    color: colors.grey,
    fontSize: '24px',
    cursor: 'pointer',
    padding: '4px',
    borderRadius: '4px',
    transition: 'color 0.2s ease',
  },
  modalBody: {
    padding: '24px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  formLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: colors.white,
    marginBottom: '8px',
  },
  formInput: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.bg,
    color: colors.white,
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  modalFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
    padding: '0 24px 24px 24px',
  },
}

export default UsersScreen