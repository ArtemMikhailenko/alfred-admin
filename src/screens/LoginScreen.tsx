import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import '../styles/LogIn.css'
import { setTokens } from '../redux/tokens'
import { AdminLogin } from '../actions/actions'
import { Eye, EyeOff, Lock, Mail, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

const LoginScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  const isFormValid = email && password
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid) return
    
    setIsLoading(true)
    
    try {
      const response = await AdminLogin(email, password)
      
      if (response.error) {
        toast.error(response.error)
        return
      }
      
      if (response.message && response.access_token) {
        dispatch(
          setTokens({
            accessToken: response.access_token,
            email: email,
          })
        )
        toast.success('Login successful!')
        navigate('/admin')
      } else {
        toast.error('Unexpected error. Please try again.')
      }
    } catch (error) {
      toast.error('Network error. Please check your connection.')
    } finally {
      setIsLoading(false)
    }
  }
  
  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-header">
          <div className="logo-container">
            <Shield className="logo-icon" />
            <h1 className="logo-text">Alfred Trade</h1>
          </div>
          <p className="login-subtitle">Admin Panel Access</p>
        </div>
        
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-container">
              <Mail className="input-icon" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="form-input"
                required
                autoComplete="email"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-container">
              <Lock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="form-input"
                required
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className={`login-button ${isFormValid ? 'active' : 'inactive'}`}
          >
            {isLoading ? (
              <div className="loading-spinner" />
            ) : (
              'Sign In'
            )}
          </button>
        </form>
        
        <div className="login-footer">
          <p>Secure admin access for Alfred Trade platform</p>
        </div>
      </div>
    </div>
  )
}

export default LoginScreen