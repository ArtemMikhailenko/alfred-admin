import React, { useState, useCallback, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  X,
  BookOpen,
  Globe,
  Plus,
  Save,
  AlertCircle,
  Check,
  Loader2,
  FileText,
  Layers
} from 'lucide-react'
import {
  Chapter,
  Language,
  languagesList,
  languagesObjString,
} from '../../constants/interfaces'
import { PostChapter } from '../../actions/actions'
import LanguageSelectorBlock from '../LanguageSelectorBlock'
import { useSelector as useReduxSelector } from 'react-redux'
import { RootState } from '../../redux'
import { clearTokens } from '../../redux/tokens'
import { ReloginAndRetry } from '../ReloginAndRetry'
import toast from 'react-hot-toast'
import styles from './CreateChapterModal.module.css'

interface CreateChapterModalProps {
  courseId: number
  onClose: (isUpdated: boolean) => void
  courseName?: string
}

const CreateChapterModal: React.FC<CreateChapterModalProps> = ({ 
  courseId, 
  onClose, 
  courseName = "Course" 
}) => {
  const tokens = useReduxSelector((state: RootState) => state.tokens)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name, setName] = useState<Record<Language, string>>(languagesObjString)
  const [localLanguage, setLocalLanguage] = useState<Language>('ua')
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Memoized validation
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {}
    
    for (const lang of languagesList) {
      const localName = name[lang]?.trim()
      
      if (!localName) {
        errors[`name_${lang}`] = `Chapter name is required in ${lang.toUpperCase()}`
      } else if (localName.length < 3) {
        errors[`name_${lang}`] = `Name must be at least 3 characters in ${lang.toUpperCase()}`
      } else if (localName.length > 80) {
        errors[`name_${lang}`] = `Name must be less than 80 characters in ${lang.toUpperCase()}`
      }
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [name])

  // Memoized validation result
  const isFormValid = useMemo(() => {
    const errors: Record<string, string> = {}
    
    for (const lang of languagesList) {
      const localName = name[lang]?.trim()
      
      if (!localName || localName.length < 3 || localName.length > 80) {
        errors[`name_${lang}`] = 'invalid'
      }
    }
    
    return Object.keys(errors).length === 0
  }, [name])

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
        const response = await PostChapter(name, courseId, accessToken)
        
        if (response.error && response.statusCode === 401) {
          return false
        }

        if (response.error) {
          throw new Error(response.error)
        }

        toast.success('Chapter created successfully!')
        onClose(false)
        return true
      }

      const success = await tryPost(tokens.accessToken)
      if (!success) {
        await ReloginAndRetry(tokens.email, dispatch, tryPost)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create chapter'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [tokens.accessToken, tokens.email, name, courseId, validateForm, logOut, dispatch, onClose])

  const handleClose = useCallback(() => {
    const hasUnsavedChanges = Object.values(name).some(n => n.trim())
    
    if (hasUnsavedChanges) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      )
      if (!confirmClose) return
    }
    
    onClose(true)
  }, [name, onClose])

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

  // Calculate completion status for each language
  const getLanguageCompletionStatus = useCallback((lang: Language) => {
    const hasName = name[lang]?.trim().length > 0
    const hasErrors = hasFieldError('name', lang)
    
    if (hasErrors) return 'error'
    if (hasName) return 'complete'
    return 'empty'
  }, [name, hasFieldError])

  const overallProgress = useMemo(() => {
    const totalFields = languagesList.length
    const completedFields = languagesList.reduce((acc, lang) => {
      return acc + (name[lang]?.trim() ? 1 : 0)
    }, 0)
    return Math.round((completedFields / totalFields) * 100)
  }, [name])

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Layers size={24} />
            </div>
            <div>
              <h2 className={styles.modalTitle}>Create New Chapter</h2>
              <p className={styles.modalSubtitle}>
                Add a new chapter to <span className={styles.courseName}>{courseName}</span>
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
                    {status === 'empty' && <div className={styles.emptyDot} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className={styles.formContent}>
          {/* Chapter Name */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>
              <FileText size={16} />
              Chapter Name
              <span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              placeholder={`Enter chapter name in ${localLanguage.toUpperCase()}...`}
              value={name[localLanguage] || ''}
              onChange={(e) => updateName(e.target.value)}
              className={`${styles.formInput} ${
                hasFieldError('name', localLanguage) ? styles.error : ''
              }`}
              disabled={isLoading}
              maxLength={80}
            />
            {hasFieldError('name', localLanguage) && (
              <div className={styles.errorMessage}>
                <AlertCircle size={14} />
                {getFieldError('name', localLanguage)}
              </div>
            )}
            <div className={styles.charCount}>
              {name[localLanguage]?.length || 0}/80 characters
            </div>
          </div>

          {/* Chapter Info */}
          <div className={styles.infoSection}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>
                <BookOpen size={20} />
              </div>
              <div className={styles.infoContent}>
                <h4 className={styles.infoTitle}>Chapter Structure</h4>
                <p className={styles.infoText}>
                  After creating this chapter, you'll be able to add lessons, quizzes, and a final test
                </p>
              </div>
            </div>
          </div>

          {/* Preview */}
          {name[localLanguage]?.trim() && (
            <div className={styles.previewSection}>
              <h4 className={styles.previewTitle}>Preview</h4>
              <div className={styles.previewCard}>
                <div className={styles.previewIcon}>
                  <Layers size={16} />
                </div>
                <div className={styles.previewContent}>
                  <h5 className={styles.previewChapterTitle}>
                    {name[localLanguage]?.trim() || 'Chapter Name'}
                  </h5>
                  <p className={styles.previewChapterMeta}>
                    Part of {courseName} • {localLanguage.toUpperCase()}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.footerLeft}>
            <div className={styles.helpText}>
              <AlertCircle size={14} />
              Fill in all languages to create a complete chapter
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
                  <Plus size={16} />
                  Create Chapter
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateChapterModal