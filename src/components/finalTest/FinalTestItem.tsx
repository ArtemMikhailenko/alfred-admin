import React from 'react'
import { HelpCircle, CheckCircle2, Users, Clock, Edit, Trash2 } from 'lucide-react'
import { Language, Quiz } from '../../constants/interfaces'
import styles from './FinalTestItem.module.css'

interface FinalTestItemProps {
  quiz: Quiz
  language: Language
  index?: number
  onEdit?: () => void
  onDelete?: () => void
  showActions?: boolean
}

const FinalTestItem: React.FC<FinalTestItemProps> = ({ 
  quiz, 
  language, 
  index = 0,
  onEdit,
  onDelete,
  showActions = false
}) => {
  const correctAnswersCount = quiz.correctAnswer[language]?.length || 0
  const totalOptionsCount = quiz.options[language]?.length || 0
  const isMultipleChoice = correctAnswersCount > 1

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.questionNumber}>
            {index + 1}
          </div>
          <div className={styles.questionIcon}>
            <HelpCircle size={18} />
          </div>
          <h4 className={styles.questionTitle}>
            {quiz.question[language] || 'Untitled Question'}
          </h4>
        </div>

        <div className={styles.headerRight}>
          <div className={styles.questionMeta}>
            <span className={styles.questionType}>
              {isMultipleChoice ? 'Multiple Choice' : 'Single Choice'}
            </span>
            <span className={styles.answerCount}>
              {correctAnswersCount}/{totalOptionsCount} correct
            </span>
          </div>

          {showActions && (
            <div className={styles.actions}>
              {onEdit && (
                <button onClick={onEdit} className={styles.editButton}>
                  <Edit size={14} />
                </button>
              )}
              {onDelete && (
                <button onClick={onDelete} className={styles.deleteButton}>
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.optionsList}>
          {quiz.options[language]?.map((option, optionIndex) => {
            const isCorrect = quiz.correctAnswer[language]?.includes(option)
            return (
              <div
                key={optionIndex}
                className={`${styles.option} ${isCorrect ? styles.correct : styles.incorrect}`}
              >
                <div className={styles.optionIcon}>
                  {isCorrect ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <div className={styles.incorrectIcon} />
                  )}
                </div>
                <span className={styles.optionText}>{option}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <Users size={12} />
            <span>Question {index + 1}</span>
          </div>
          <div className={styles.stat}>
            <Clock size={12} />
            <span>~2 min</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(FinalTestItem)
