import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  X,
  BookOpen,
  Globe,
  FileText,
  Save,
  AlertCircle,
  Check,
  Loader2
} from 'lucide-react'
import { PostCourse } from '../../actions/actions'
import LanguageSelectorBlock from '../LanguageSelectorBlock'
import {
  Language,
  languagesList,
  languagesObjString,
} from '../../constants/interfaces'
import { useSelector as useReduxSelector } from 'react-redux'
import { RootState } from '../../redux'
import { clearTokens } from '../../redux/tokens'
import { ReloginAndRetry } from '../ReloginAndRetry'
import toast from 'react-hot-toast'
import styles from './CreateCourseModal.module.css'

interface CreateCourseModalProps {
  onClose: (isUpdated: boolean) => void
}

const CreateCourseModal: React.FC<CreateCourseModalProps> = ({ onClose }) => {
  const tokens = useReduxSelector((state: RootState) => state.tokens)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState<Record<Language, string>>(languagesObjString)
  const [description, setDescription] = useState<Record<Language, string>>(languagesObjString)
  const [localLanguage, setLocalLanguage] = useState<Language>('ua')
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Memoized validation function
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {}
    
    for (const lang of languagesList) {
      const localName = name[lang]?.trim()
      const localDescription = description[lang]?.trim()
      
      if (!localName) {
        errors[`name_${lang}`] = `Course title is required in ${lang.toUpperCase()}`
      } else if (localName.length < 3) {
        errors[`name_${lang}`] = `Title must be at least 3 characters in ${lang.toUpperCase()}`
      } else if (localName.length > 100) {
        errors[`name_${lang}`] = `Title must be less than 100 characters in ${lang.toUpperCase()}`
      }
      
      if (!localDescription) {
        errors[`description_${lang}`] = `Course description is required in ${lang.toUpperCase()}`
      } else if (localDescription.length < 10) {
        errors[`description_${lang}`] = `Description must be at least 10 characters in ${lang.toUpperCase()}`
      } else if (localDescription.length > 500) {
        errors[`description_${lang}`] = `Description must be less than 500 characters in ${lang.toUpperCase()}`
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [name, description])

  // Memoized validation result
  const isFormValid = useMemo(() => {
    const errors: Record<string, string> = {}
    
    for (const lang of languagesList) {
      const localName = name[lang]?.trim()
      const localDescription = description[lang]?.trim()
      
      if (!localName || localName.length < 3 || localName.length > 100) {
        errors[`name_${lang}`] = 'invalid'
      }
      
      if (!localDescription || localDescription.length < 10 || localDescription.length > 500) {
        errors[`description_${lang}`] = 'invalid'
      }
    }
    
    return Object.keys(errors).length === 0
  }, [name, description])

  const getFieldError = useCallback((field: string, lang: Language) => {
    return validationErrors[`${field}_${lang}`]
  }, [validationErrors])

  const hasFieldError = useCallback((field: string, lang: Language) => {
    return !!validationErrors[`${field}_${lang}`]
  }, [validationErrors])

  const logOut = useCallback(() => {
    localStorage.clear()
    dispatch(clearTokens())
    navigate('/login')
  }, [dispatch, navigate])

  const handleSave = useCallback(async () => {
    if (!tokens.accessToken || !tokens.email) {
      logOut()
      return
    }

    if (!validateForm()) {
      toast.error('Please fix validation errors')
      return
    }

    setIsLoading(true)

    try {
      const tryPost = async (accessToken: string): Promise<boolean> => {
        const response = await PostCourse(name, description, accessToken)
        
        if (response.error && response.statusCode === 401) {
          return false
        }

        if (response.error) {
          throw new Error(response.error)
        }

        toast.success('Course created successfully!')
        onClose(false)
        return true
      }

      const success = await tryPost(tokens.accessToken)
      if (!success) {
        await ReloginAndRetry(tokens.email, dispatch, tryPost)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create course'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [tokens.accessToken, tokens.email, name, description, validateForm, logOut, dispatch, onClose])

  const handleClose = useCallback(() => {
    const hasUnsavedChanges = Object.values(name).some(n => n.trim()) || 
                             Object.values(description).some(d => d.trim())
    
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      )
      if (!confirmClose) return
    }
    
    onClose(true)
  }, [name, description, onClose])

  const updateName = useCallback((value: string) => {
    setName(prev => ({ ...prev, [localLanguage]: value }))
    // Clear validation error for this field
    if (validationErrors[`name_${localLanguage}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`name_${localLanguage}`]
        return newErrors
      })
    }
  }, [localLanguage, validationErrors])

  const updateDescription = useCallback((value: string) => {
    setDescription(prev => ({ ...prev, [localLanguage]: value }))
    // Clear validation error for this field
    if (validationErrors[`description_${localLanguage}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`description_${localLanguage}`]
        return newErrors
      })
    }
  }, [localLanguage, validationErrors])

  // Calculate completion status for each language
  const getLanguageCompletionStatus = useCallback((lang: Language) => {
    const hasName = name[lang]?.trim().length > 0
    const hasDescription = description[lang]?.trim().length > 0
    const hasErrors = hasFieldError('name', lang) || hasFieldError('description', lang)
    
    if (hasErrors) return 'error'
    if (hasName && hasDescription) return 'complete'
    if (hasName || hasDescription) return 'partial'
    return 'empty'
  }, [name, description, hasFieldError])

  const overallProgress = useMemo(() => {
    const totalFields = languagesList.length * 2
    const completedFields = languagesList.reduce((acc, lang) => {
      return acc + 
        (name[lang]?.trim() ? 1 : 0) + 
        (description[lang]?.trim() ? 1 : 0)
    }, 0)
    return Math.round((completedFields / totalFields) * 100)
  }, [name, description])

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <BookOpen size={24} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>Create New Course</h2>
              <p className={styles.modalSubtitle}>
                Build a comprehensive trading course for your students
              </p>
            </div>
          </div>
          
          <button 
            onClick={handleClose} 
            className={styles.closeButton}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressHeader}>
            <span className={styles.progressLabel}>Form Completion</span>
            <span className={styles.progressPercentage}>{overallProgress}%</span>
          </div>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>

        {/* Language Tabs */}
        <div className={styles.languageSection}>
          <div className={styles.languageHeader}>
            <Globe size={16} />
            <span>Language</span>
          </div>
          
          <div className={styles.languageTabs}>
            {languagesList.map((lang) => {
              const status = getLanguageCompletionStatus(lang)
              return (
                <button
                  key={lang}
                  onClick={() => setLocalLanguage(lang)}
                  className={`${styles.languageTab} ${
                    localLanguage === lang ? styles.active : ''
                  } ${styles[status]}`}
                  disabled={isLoading}
                >
                  <span className={styles.languageCode}>{lang.toUpperCase()}</span>
                  <div className={styles.statusIcon}>
                    {status === 'complete' && <Check size={12} />}
                    {status === 'error' && <AlertCircle size={12} />}
                    {status === 'partial' && <div className={styles.partialDot} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className={styles.formContent}>
          {/* Course Title */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FileText size={16} />
              Course Title
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder={`Enter course title in ${localLanguage.toUpperCase()}...`}
              value={name[localLanguage] || ''}
              onChange={(e) => updateName(e.target.value)}
              className={`${styles.formInput} ${
                hasFieldError('name', localLanguage) ? styles.error : ''
              }`}
              disabled={isLoading}
              maxLength={100}
            />
            {hasFieldError('name', localLanguage) && (
              <div className={styles.errorMessage}>
                <AlertCircle size={14} />
                {getFieldError('name', localLanguage)}
              </div>
            )}
            <div className={styles.charCount}>
              {name[localLanguage]?.length || 0}/100 characters
            </div>
          </div>

          {/* Course Description */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FileText size={16} />
              Course Description
              <span className={styles.required}>*</span>
            </label>
            <textarea
              placeholder={`Enter course description in ${localLanguage.toUpperCase()}...`}
              value={description[localLanguage] || ''}
              onChange={(e) => updateDescription(e.target.value)}
              className={`${styles.formTextarea} ${
                hasFieldError('description', localLanguage) ? styles.error : ''
              }`}
              disabled={isLoading}
              rows={4}
              maxLength={500}
            />
            {hasFieldError('description', localLanguage) && (
              <div className={styles.errorMessage}>
                <AlertCircle size={14} />
                {getFieldError('description', localLanguage)}
              </div>
            )}
            <div className={styles.charCount}>
              {description[localLanguage]?.length || 0}/500 characters
            </div>
          </div>

          {/* Preview */}
          {(name[localLanguage]?.trim() || description[localLanguage]?.trim()) && (
            <div className={styles.previewSection}>
              <h4 className={styles.previewTitle}>Preview</h4>
              <div className={styles.previewCard}>
                <h5 className={styles.previewCourseTitle}>
                  {name[localLanguage]?.trim() || 'Course Title'}
                </h5>
                <p className={styles.previewCourseDescription}>
                  {description[localLanguage]?.trim() || 'Course description...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.footerLeft}>
            <div className={styles.helpText}>
              <AlertCircle size={14} />
              Fill in all languages to create a complete course
            </div>
          </div>
          
          <div className={styles.footerActions}>
            <button 
              onClick={handleClose} 
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </button>
            
            <button
              onClick={handleSave}
              disabled={!isFormValid || isLoading}
              className={`${styles.saveButton} ${
                isFormValid && !isLoading ? styles.enabled : styles.disabled
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  Creating...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Create Course
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateCourseModal