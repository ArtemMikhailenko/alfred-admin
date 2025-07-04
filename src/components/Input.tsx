import React, { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'
import './styles.css'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: LucideIcon
  rightIcon?: LucideIcon
  onRightIconClick?: () => void
  fullWidth?: boolean
  variant?: 'default' | 'filled' | 'outlined'
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  onRightIconClick,
  fullWidth = false,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const inputClasses = [
    'input',
    `input-${variant}`,
    fullWidth && 'input-full',
    error && 'input-error',
    LeftIcon && 'input-with-left-icon',
    RightIcon && 'input-with-right-icon',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={`input-group ${fullWidth ? 'input-group-full' : ''}`}>
      {label && (
        <label className="input-label">
          {label}
        </label>
      )}
      
      <div className="input-container">
        {LeftIcon && (
          <LeftIcon className="input-icon input-icon-left" />
        )}
        
        <input
          ref={ref}
          className={inputClasses}
          {...props}
        />
        
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="input-icon input-icon-right input-icon-button"
          >
            <RightIcon />
          </button>
        )}
      </div>
      
      {error && (
        <span className="input-error-text">
          {error}
        </span>
      )}
      
      {hint && !error && (
        <span className="input-hint">
          {hint}
        </span>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input