import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  BookOpen,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  ChevronRight,
  Bell,
  Search,
  User,
  Plus,
  UserPlus,
  Grid,
  List,
  BarChart3
} from 'lucide-react'
import { RootState } from '../../redux'
import { clearTokens } from '../../redux/tokens'
import { Language } from '../../constants/interfaces'
import toast from 'react-hot-toast'
import './styles.css'
import LanguageSelectorBlock from '../LanguageSelectorBlock/LanguageSelectorBlock'

interface MainLayoutProps {
  children: React.ReactNode
  onCreateCourse?: () => void
  onCreateAdmin?: () => void
  onOpenSwipeTrade?: () => void
  onOpenUsers?: () => void // Added this prop
  searchTerm?: string
  onSearchChange?: (value: string) => void
  language?: Language
  onLanguageChange?: (lang: Language) => void
  viewMode?: 'grid' | 'list'
  onViewModeChange?: (mode: 'grid' | 'list') => void
}

const MainLayout: React.FC<MainLayoutProps> = ({ 
  children,
  onCreateCourse,
  onCreateAdmin,
  onOpenSwipeTrade,
  onOpenUsers, // Added this prop
  searchTerm = '',
  onSearchChange,
  language = 'ua',
  onLanguageChange,
  viewMode = 'grid',
  onViewModeChange
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()
  const tokens = useSelector((state: RootState) => state.tokens)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const menuItems = [
    {
      id: 'admin',
      label: 'Dashboard',
      icon: Home,
      path: '/admin',
      description: 'Overview and statistics'
    },
    {
      id: 'courses',
      label: 'Courses',
      icon: BookOpen,
      path: '/courses',
      description: 'Manage courses and content'
    },
    {
      id: 'swipetrade',
      label: 'Swipe Trade',
      icon: TrendingUp,
      path: '/swipetrade',
      description: 'Trading quizzes and charts'
    },
    {
      id: 'users',
      label: 'Users',
      icon: Users,
      path: '/users',
      description: 'User management and admins'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      path: '/analytics',
      description: 'Analytics and reports'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      description: 'System configuration'
    }
  ]

  const handleLogout = () => {
    dispatch(clearTokens())
    localStorage.clear()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const handleMenuClick = (path: string) => {
    navigate(path)
    setSidebarOpen(false)
  }

  const isActiveRoute = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin'
    }
    return location.pathname.startsWith(path)
  }

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find(item => isActiveRoute(item.path))
    return currentItem?.label || 'Dashboard'
  }

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    const breadcrumbs = [{ label: 'Home', path: '/admin' }]
    
    if (pathSegments[0] === 'courses') {
      breadcrumbs.push({ label: 'Courses', path: '/courses' })
    } else if (pathSegments[0] === 'swipetrade') {
      breadcrumbs.push({ label: 'Swipe Trade', path: '/swipetrade' })
    } else if (pathSegments[0] === 'users') {
      breadcrumbs.push({ label: 'Users', path: '/users' })
    } else if (pathSegments[0] === 'analytics') {
      breadcrumbs.push({ label: 'Analytics', path: '/analytics' })
    } else if (pathSegments[0] === 'course') {
      breadcrumbs.push({ label: 'Courses', path: '/courses' })
      breadcrumbs.push({ label: `Course ${pathSegments[1]}`, path: `/course/${pathSegments[1]}` })
    } else if (pathSegments[0] === 'chapter') {
      breadcrumbs.push({ label: 'Courses', path: '/courses' })
      breadcrumbs.push({ label: `Course ${pathSegments[1]}`, path: `/course/${pathSegments[1]}` })
      breadcrumbs.push({ label: `Chapter ${pathSegments[2]}`, path: location.pathname })
    }
    
    return breadcrumbs
  }

  // Quick actions based on current page
  const getPageActions = () => {
    const path = location.pathname
    const actions = []

    if (path === '/courses' && onCreateCourse) {
      actions.push({
        label: 'New Course',
        icon: Plus,
        onClick: onCreateCourse,
        variant: 'primary' as const
      })
    }

    if (path === '/users' && onCreateAdmin) {
      actions.push({
        label: 'Add Admin',
        icon: UserPlus,
        onClick: onCreateAdmin,
        variant: 'primary' as const
      })
    }

    if (path === '/swipetrade' && onOpenSwipeTrade) {
      actions.push({
        label: 'New Quiz',
        icon: Plus,
        onClick: onOpenSwipeTrade,
        variant: 'primary' as const
      })
    }

    // View mode toggle for supported pages
    if ((path === '/courses' || path === '/users') && onViewModeChange) {
      actions.push({
        label: viewMode === 'grid' ? 'List View' : 'Grid View',
        icon: viewMode === 'grid' ? List : Grid,
        onClick: () => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid'),
        variant: 'secondary' as const
      })
    }

    return actions
  }

  return (
    <div className="layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <TrendingUp size={24} />
            </div>
            <h2 className="logo-text">Alfred Trade</h2>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul className="nav-list">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleMenuClick(item.path)}
                  className={`nav-item ${isActiveRoute(item.path) ? 'nav-item-active' : ''}`}
                >
                  <item.icon size={20} />
                  <div className="nav-item-content">
                    <span className="nav-item-label">{item.label}</span>
                    <span className="nav-item-description">{item.description}</span>
                  </div>
                  {isActiveRoute(item.path) && (
                    <div className="nav-item-indicator" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">
              <User size={20} />
            </div>
            <div className="user-details">
              <span className="user-email">{tokens.email}</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <button 
            className="logout-btn"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div className="header-left">
            <button 
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="breadcrumbs">
              {getBreadcrumbs().map((crumb, index) => (
                <div key={index} className="breadcrumb-item">
                  <button 
                    onClick={() => navigate(crumb.path)}
                    className="breadcrumb-link"
                  >
                    {crumb.label}
                  </button>
                  {index < getBreadcrumbs().length - 1 && (
                    <ChevronRight size={16} className="breadcrumb-separator" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Header Center with Search */}
          <div className="header-center">
            <div className="search-container">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="search-input"
                value={searchTerm}
                onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </div>
          </div>

          {/* Header Right */}
          <div className="header-right">
            {/* Page Actions */}
            <div className="page-actions">
              {getPageActions().map((action, index) => (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={`action-btn ${action.variant === 'primary' ? 'action-btn-primary' : 'action-btn-secondary'}`}
                >
                  <action.icon size={16} />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>

            <LanguageSelectorBlock 
              language={language} 
              setLanguage={onLanguageChange || (() => {})} 
            />
            
            <button className="notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            
            <div className="user-menu">
              <div className="user-avatar-small">
                <User size={16} />
              </div>
              <span className="user-name">Admin</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="page-content">
          {/* <div className="content-header">
            <div className="content-header-left">
              <h1 className="page-title">{getCurrentPageTitle()}</h1>
              <p className="page-description">
                {menuItems.find(item => isActiveRoute(item.path))?.description}
              </p>
            </div>
          </div> */}
          <div className="content-body">
            {children}
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default MainLayout