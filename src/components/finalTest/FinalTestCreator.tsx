import React, { useState, useCallback, useMemo } from 'react'
import {
  Save,
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  Globe,
  BookOpen,
  HelpCircle,
  Target,
  Loader2,
  Plus,
  Edit,
  Trash2
} from 'lucide-react'
import { Chapter, FinalTest, Language, Quiz, languagesList } from '../../constants/interfaces'
import QuizCreationBlock from '../quiz/QuizCreationBlock'
import { PostFinalTest } from '../../actions/actions'
import styles from './FinalTestCreator.module.css'

interface FinalTestCreatorProps {
  chapter: Chapter | undefined
  onClose: (isUpdated: boolean) => void
  initialQuiz: FinalTest
}

const FinalTestCreator: React.FC<FinalTestCreatorProps> = ({
  chapter,
  onClose,
  initialQuiz,
}) => {
  const [quiz, setQuiz] = useState<Quiz[]>(initialQuiz)
  const [language, setLanguage] = useState<Language>('ua')
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<string[]>([])

  // Validation
  const validateQuiz = useCallback(() => {
    const errors: string[] = []
    
    if (quiz.length === 0) {
      errors.push('At least one quiz question is required')
    }
    
    quiz.forEach((q, index) => {
      languagesList.forEach(lang => {
        if (!q.question[lang]?.trim()) {
          errors.push(`Question ${index + 1}: Title required in ${lang.toUpperCase()}`)
        }
        
        if (!q.options[lang] || q.options[lang].length < 2) {
          errors.push(`Question ${index + 1}: At least 2 options required in ${lang.toUpperCase()}`)
        }
        
        if (!q.correctAnswer[lang] || q.correctAnswer[lang].length === 0) {
          errors.push(`Question ${index + 1}: At least one correct answer required in ${lang.toUpperCase()}`)
        }
      })
    })
    
    setValidationErrors(errors)
    return errors.length === 0
  }, [quiz])

  const isFormValid = useMemo(() => {
    return quiz.length > 0 && quiz.every(q => 
      languagesList.every(lang => 
        q.question[lang]?.trim() && 
        q.options[lang]?.length >= 2 && 
        q.correctAnswer[lang]?.length > 0
      )
    )
  }, [quiz])

  const completionStats = useMemo(() => {
    const totalQuestions = quiz.length
    const completedQuestions = quiz.filter(q =>
      languagesList.every(lang =>
        q.question[lang]?.trim() &&
        q.options[lang]?.length >= 2 &&
        q.correctAnswer[lang]?.length > 0
      )
    ).length
    
    return {
      total: totalQuestions,
      completed: completedQuestions,
      percentage: totalQuestions > 0 ? Math.round((completedQuestions / totalQuestions) * 100) : 0
    }
  }, [quiz])

  const getLanguageCompletionStatus = useCallback((lang: Language) => {
    const hasQuestions = quiz.every(q => q.question[lang]?.trim())
    const hasOptions = quiz.every(q => q.options[lang]?.length >= 2)
    const hasAnswers = quiz.every(q => q.correctAnswer[lang]?.length > 0)
    
    if (hasQuestions && hasOptions && hasAnswers) return 'complete'
    if (hasQuestions || hasOptions || hasAnswers) return 'partial'
    return 'empty'
  }, [quiz])

  const handleSave = async () => {
    if (!chapter?.id) return
    
    if (!validateQuiz()) {
      return
    }

    setIsLoading(true)

    try {
      const newQuiz = quiz.map((q: Quiz) => ({
        options: q.options,
        correctAnswer: q.correctAnswer,
        question: q.question,
      }))
      
      const response = await PostFinalTest(newQuiz, chapter.id)
      
      if (response.error) {
        throw new Error(response.error)
      }
      
      onClose(false)
    } catch (error) {
      alert('Failed to save final test')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    const hasChanges = quiz.length > 0 && quiz.some(q => 
      Object.values(q.question).some(text => text.trim()) ||
      Object.values(q.options).some(opts => opts.length > 0)
    )
    
    if (hasChanges) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      )
      if (!confirmClose) return
    }
    
    onClose(true)
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <Award size={24} />
          </div>
          <div>
            <h2 className={styles.headerTitle}>Final Test</h2>
            <p className={styles.headerSubtitle}>
              {chapter?.name[language] || 'Unknown Chapter'}
            </p>
          </div>
        </div>

        <div className={styles.headerRight}>
          {/* Language Selector */}
          <div className={styles.languageSection}>
            <Globe size={16} />
            <div className={styles.languageTabs}>
              {languagesList.map((lang) => {
                const status = getLanguageCompletionStatus(lang)
                return (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`${styles.languageTab} ${
                      language === lang ? styles.active : ''
                    } ${styles[status]}`}
                    disabled={isLoading}
                  >
                    <span>{lang.toUpperCase()}</span>
                    <div className={styles.statusIcon}>
                      {status === 'complete' && <CheckCircle2 size={12} />}
                      {status === 'partial' && <AlertCircle size={12} />}
                      {status === 'empty' && <div className={styles.emptyDot} />}
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <button
            onClick={handleClose}
            disabled={isLoading}
            className={styles.closeButton}
          >
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Stats Bar */}
      <div className={styles.statsBar}>
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <HelpCircle size={18} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Questions</span>
              <span className={styles.statValue}>{completionStats.total}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <CheckCircle2 size={18} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Completed</span>
              <span className={styles.statValue}>{completionStats.completed}</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Target size={18} />
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>Progress</span>
              <span className={styles.statValue}>{completionStats.percentage}%</span>
            </div>
          </div>
        </div>

        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill}
              style={{ width: `${completionStats.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className={styles.errorSection}>
          <div className={styles.errorHeader}>
            <AlertCircle size={16} />
            <span>Please fix the following issues:</span>
          </div>
          <ul className={styles.errorList}>
            {validationErrors.map((error, index) => (
              <li key={index} className={styles.errorItem}>
                {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Content */}
      <div className={styles.content}>
        <QuizCreationBlock 
          quiz={quiz} 
          setQuiz={setQuiz} 
          language={language} 
        />
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <div className={styles.footerLeft}>
          <div className={styles.helpText}>
            <BookOpen size={14} />
            Create comprehensive questions to test chapter knowledge
          </div>
        </div>

        <div className={styles.footerActions}>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className={styles.cancelButton}
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
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save Final Test
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default FinalTestCreator
