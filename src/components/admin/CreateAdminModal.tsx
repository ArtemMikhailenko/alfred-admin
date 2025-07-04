import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  X, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react'
import { RootState } from '../../redux'
import { clearTokens } from '../../redux/tokens'
import { AdminRegister } from '../../actions/actions'
import { ReloginAndRetry } from '../ReloginAndRetry'
import toast from 'react-hot-toast'
import './styles.css'
interface CreateAdminModalProps {
  onClose: (isUpdated: boolean) => void
}

const CreateAdminModal: React.FC<CreateAdminModalProps> = ({ onClose }) => {
  const tokens = useSelector((state: RootState) => state.tokens)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [step, setStep] = useState<'form' | 'success'>('form')

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    if (!tokens.accessToken || !tokens.email) {
      toast.error('Session expired. Please login again.')
      dispatch(clearTokens())
      navigate('/login')
      return
    }

    setIsLoading(true)

    try {
      const tryPost = async (accessToken: string): Promise<boolean> => {
        const response = await AdminRegister(formData.email, formData.password, accessToken)
        
        if (response.error) {
          if (response.statusCode === 401) {
            return false
          }
          throw new Error(response.error)
        }

        return true
      }

      const success = await tryPost(tokens.accessToken)
      
      if (success) {
        setStep('success')
        toast.success('Admin created successfully!')
        setTimeout(() => {
          onClose(false)
        }, 2000)
      } else {
        await ReloginAndRetry(tokens.email, dispatch, tryPost)
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to create admin')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (step === 'success') {
      onClose(false)
    } else {
      onClose(true)
    }
  }

  const passwordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, label: '', color: '#EF4444', feedback: [] }
    
    let strength = 0
    let feedback: string[] = []
    
    if (password.length >= 8) {
      strength += 1
      feedback.push('8+ characters')
    }
    if (/[A-Z]/.test(password)) {
      strength += 1
      feedback.push('uppercase')
    }
    if (/[a-z]/.test(password)) {
      strength += 1
      feedback.push('lowercase')
    }
    if (/\d/.test(password)) {
      strength += 1
      feedback.push('number')
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      strength += 1
      feedback.push('special char')
    }

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']
    const colors = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981', '#059669']
    
    return {
      strength,
      label: labels[Math.min(strength - 1, 4)] || 'Very Weak',
      color: colors[Math.min(strength - 1, 4)] || '#EF4444',
      feedback
    }
  }

  const strengthInfo = passwordStrength()

  if (step === 'success') {
    return (
      <div className="create-admin-modal">
        <div className="modal-success">
          <div className="success-icon">
            <CheckCircle size={64} />
          </div>
          <h2>Admin Created Successfully!</h2>
          <p>The new admin account has been created and is ready to use.</p>
          <div className="success-details">
            <div className="success-detail">
              <Mail size={20} />
              <span>{formData.email}</span>
            </div>
            <div className="success-detail">
              <Shield size={20} />
              <span>Admin privileges granted</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="create-admin-modal">
      <div className="modal-header">
        <div className="modal-title-section">
          <div className="modal-icon">
            <UserPlus size={24} />
          </div>
          <div>
            <h2 className="modal-title">Create New Admin</h2>
            <p className="modal-subtitle">Add a new administrator to the system</p>
          </div>
        </div>
        <button className="modal-close-btn" onClick={handleClose}>
          <X size={20} />
        </button>
      </div>

      <div className="modal-content">
        <div className="admin-form-container">
          <form onSubmit={handleSubmit} className="admin-form">
            {/* Email Field */}
            <div className="form-group">
              <label className="form-label">
                Email Address <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Mail size={20} />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="admin@example.com"
                  className={`form-input ${errors.email ? 'error' : ''}`}
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label className="form-label">
                Password <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter secure password"
                  className={`form-input ${errors.password ? 'error' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              
              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ 
                        width: `${(strengthInfo.strength / 5) * 100}%`,
                        backgroundColor: strengthInfo.color
                      }}
                    />
                  </div>
                  <div className="strength-info">
                    <span style={{ color: strengthInfo.color }}>{strengthInfo.label}</span>
                    <span className="strength-requirements">
                      {strengthInfo.feedback.join(', ')}
                    </span>
                  </div>
                </div>
              )}
              
              {errors.password && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{errors.password}</span>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label className="form-label">
                Confirm Password <span className="required">*</span>
              </label>
              <div className="input-wrapper">
                <div className="input-icon">
                  <Lock size={20} />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm password"
                  className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <div className="error-message">
                  <AlertCircle size={16} />
                  <span>{errors.confirmPassword}</span>
                </div>
              )}
            </div>
            <div className="modal-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleClose}
          disabled={isLoading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={isLoading || !formData.email || !formData.password || !formData.confirmPassword}
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Creating Admin...
            </>
          ) : (
            <>
              <UserPlus size={16} />
              Create Admin
            </>
          )}
        </button>
      </div>
            {/* Security Notice */}
            <div className="security-notice">
              <Shield size={20} />
              <div>
                <p className="notice-title">Security Notice</p>
                <p className="notice-text">
                  The new admin will have full access to the system. Make sure to share credentials securely.
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

     
    </div>
  )
}

export default CreateAdminModal