import { CSSProperties, useState } from 'react'
import { Language, Quiz } from '../../constants/interfaces'
import colors from '../../constants/colors'
import globalStyles from '../../constants/globalStyles'
import {
  addCorrectAnswer,
  addOption,
  handleCreateQuiz,
  isQuizValid,
  removeCorrectAnswer,
  removeOption,
  updateOption,
} from '../../functions/quizFunctions'
import LanguageSelectorBlock from '../LanguageSelectorBlock'

export default function QuizCreationBlock({
  quiz,
  setQuiz,
  language,
}: {
  quiz: Quiz[]
  setQuiz: (i: Quiz[]) => void
  language: Language
}) {
  const [newQuizBlock, setNewQuizBlock] = useState<Quiz | null>(null)
  const [localLanguage, setLocalLanguage] = useState<Language>(language)

  const handleRemoveQuizItem = (i: number) => {
    setQuiz([...quiz].filter((_, index) => index !== i))
  }

  const handleSaveQuiz = () => {
    if (!newQuizBlock || !isQuizValid(newQuizBlock)) {
      alert(
        '• title must be non empty\n• variants must be unique and non empty\n• at least one answer'
      )
      return
    }

    if (!Array.isArray(quiz)) {
      console.error('Quiz is not an array:', quiz)
      return
    }

    const exists =
      typeof newQuizBlock.index === 'number' &&
      quiz[newQuizBlock?.index] !== undefined

    if (exists) {
      const newQuizzes = quiz.map((q, index) =>
        index === newQuizBlock.index ? newQuizBlock : q
      )
      setQuiz(newQuizzes)
    } else {
      setQuiz([...quiz, newQuizBlock])
    }

    setNewQuizBlock(null)
  }

  const handleCancelQuiz = () => {
    setNewQuizBlock(null)
  }

  return (
    <div style={styles.container}>
      {!newQuizBlock && (
        <div style={styles.headerSection}>
          <div style={styles.headerContent}>
            <h3 style={styles.sectionTitle}>
              <span style={styles.titleIcon}>🧠</span>
              Quiz Management
            </h3>
            <button
              style={styles.createButton}
              onClick={() => setNewQuizBlock(handleCreateQuiz(quiz))}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 6px 20px ${colors.yellow}40`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = `0 4px 16px ${colors.yellow}30`
              }}
            >
              <span style={styles.buttonIcon}>➕</span>
              Create Quiz
            </button>
          </div>
        </div>
      )}

      {newQuizBlock ? (
        <div style={styles.editorContainer}>
          <div style={styles.editorHeader}>
            <h3 style={styles.editorTitle}>
              {typeof newQuizBlock.index === 'number' ? 'Edit Quiz' : 'Create New Quiz'}
            </h3>
          </div>

          <div style={styles.languageSection}>
            <LanguageSelectorBlock
              language={localLanguage}
              setLanguage={setLocalLanguage}
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>❓</span>
              Quiz Question
            </label>
            <input
              type="text"
              placeholder="Enter your quiz question..."
              value={newQuizBlock.question[localLanguage]}
              onChange={(e) =>
                setNewQuizBlock({
                  ...newQuizBlock,
                  question: {
                    ...newQuizBlock.question,
                    [localLanguage]: e.target.value,
                  },
                })
              }
              style={styles.titleInput}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = colors.yellow
                e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.yellow}20`
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = colors.border
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>

          <div style={styles.optionsSection}>
            <label style={styles.label}>
              <span style={styles.labelIcon}>📝</span>
              Answer Options
            </label>
            
            {newQuizBlock.options[localLanguage].map((option, index) => (
              <div key={index} style={styles.optionRow}>
                <button
                  style={{
                    ...styles.correctButton,
                    backgroundColor: newQuizBlock.correctAnswer[localLanguage].includes(option) 
                      ? colors.green 
                      : colors.greyhard,
                    borderColor: newQuizBlock.correctAnswer[localLanguage].includes(option) 
                      ? colors.green 
                      : colors.border,
                  }}
                  onClick={() => {
                    if (newQuizBlock.correctAnswer[localLanguage].includes(option)) {
                      setNewQuizBlock(removeCorrectAnswer(index, newQuizBlock))
                    } else {
                      setNewQuizBlock(addCorrectAnswer(index, newQuizBlock))
                    }
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  {newQuizBlock.correctAnswer[localLanguage].includes(option) ? '✅' : '⭕'}
                </button>
                
                <input
                  type="text"
                  placeholder={`Option ${index + 1}...`}
                  value={option}
                  onChange={(e) => {
                    setNewQuizBlock(
                      updateOption(
                        index,
                        e.target.value,
                        newQuizBlock,
                        localLanguage
                      )
                    )
                  }}
                  style={styles.optionInput}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = colors.yellow
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.yellow}20`
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = colors.border
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
                
                <button
                  style={styles.deleteOptionButton}
                  onClick={() =>
                    setNewQuizBlock(removeOption(index, newQuizBlock))
                  }
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.red
                    e.currentTarget.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.greyhard
                    e.currentTarget.style.transform = 'scale(1)'
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>

          <div style={styles.actionSection}>
            <button
              style={styles.addOptionButton}
              onClick={() => setNewQuizBlock(addOption(newQuizBlock))}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = colors.yellow + 'dd'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = colors.yellow + 'aa'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
            >
              <span style={styles.buttonIcon}>➕</span>
              Add Option
            </button>
            
            <div style={styles.saveActions}>
              <button 
                style={styles.saveButton} 
                onClick={handleSaveQuiz}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.green
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = `0 4px 12px ${colors.green}40`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.green + 'dd'
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              >
                <span style={styles.buttonIcon}>💾</span>
                Save Quiz
              </button>
              
              <button 
                style={styles.cancelButton} 
                onClick={handleCancelQuiz}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = colors.red
                  e.currentTarget.style.transform = 'translateY(-1px)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = colors.greyhard
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <span style={styles.buttonIcon}>❌</span>
                Cancel
              </button>
            </div>
          </div>

          <div style={styles.helpText}>
            <span style={styles.helpIcon}>💡</span>
            <p style={styles.helpMessage}>
              Tip: First add all answer options, then mark the correct ones by clicking the circle buttons
            </p>
          </div>
        </div>
      ) : (
        <div style={styles.quizList}>
          {Array.isArray(quiz) &&
            quiz.map((q: Quiz, index: number) => (
              <div style={styles.quizCard} key={index}>
                <div style={styles.quizHeader}>
                  <div style={styles.quizNumber}>{index + 1}</div>
                  <h4 style={styles.quizTitle}>
                    {q.question[language]}
                  </h4>
                  <div style={styles.quizActions}>
                    <button
                      style={styles.editButton}
                      onClick={() => setNewQuizBlock({ index: index, ...q })}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.yellow
                        e.currentTarget.style.color = colors.black
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.yellow + 'aa'
                        e.currentTarget.style.color = colors.white
                      }}
                    >
                      <span style={styles.buttonIcon}>✏️</span>
                      Edit
                    </button>
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleRemoveQuizItem(index)}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = colors.red
                        e.currentTarget.style.transform = 'scale(1.05)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = colors.red + 'dd'
                        e.currentTarget.style.transform = 'scale(1)'
                      }}
                    >
                      <span style={styles.buttonIcon}>🗑️</span>
                      Delete
                    </button>
                  </div>
                </div>
                
                <div style={styles.optionsList}>
                  {q.options[language].map((option: string, optionIndex: number) => (
                    <div style={styles.optionPreview} key={optionIndex}>
                      <span style={styles.optionStatus}>
                        {q.correctAnswer[language].includes(option) ? '✅' : '⭕'}
                      </span>
                      <span style={styles.optionText}>{option}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100vh', // Изменено с 80vh на 100vh
    backgroundColor: colors.greyhard,
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
    // overflow: 'hidden',
    
  },

  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexShrink: 0,
    padding: '16px 16px 0 16px',
  },

  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },

  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: colors.white,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '-0.02em',
  },

  titleIcon: {
    fontSize: '20px',
  },

  createButton: {
    height: '40px',
    padding: '0 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: colors.yellow,
    color: colors.black,
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 2px 8px ${colors.yellow}30`,
  },

  editorContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '8px',
    backgroundColor: colors.bg,
    borderRadius: '10px',
    border: `1px solid ${colors.border}`,
    flex: 1,
    minHeight: 0,
    maxHeight: 'calc(100vh - 200px)', // Добавлено ограничение максимальной высоты
    overflowY: 'scroll', // Включен скролл
  },

  editorHeader: {
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: '12px',
    flexShrink: 0,
  },

  editorTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: colors.white,
    margin: 0,
  },

  languageSection: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexShrink: 0, // Добавлено
  },

  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexShrink: 0, // Добавлено
  },

  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.grey,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  labelIcon: {
    fontSize: '16px',
  },

  titleInput: {
    height: '44px',
    padding: '0 12px',
    borderRadius: '10px',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.greyhard,
    color: colors.white,
    fontSize: '16px',
    fontWeight: '600',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  optionsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1, // Позволяет секции расширяться
    minHeight: 0, // Позволяет сжиматься
  },

  optionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0, // Предотвращает сжатие строк
  },

  correctButton: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '2px solid',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
  },

  optionInput: {
    flex: 1,
    height: '40px',
    padding: '0 12px',
    borderRadius: '10px',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.greyhard,
    color: colors.white,
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  deleteOptionButton: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.greyhard,
    color: colors.white,
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
  },

  actionSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${colors.border}`,
    flexShrink: 0,
    marginTop: 'auto', // Прижимает к низу
  },

  addOptionButton: {
    height: '44px',
    padding: '0 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: colors.yellow + 'aa',
    color: colors.black,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  saveActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap', // Добавлено для адаптивности
  },

  saveButton: {
    height: '40px',
    padding: '0 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: colors.green + 'dd',
    color: colors.white,
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  cancelButton: {
    height: '40px',
    padding: '0 20px',
    borderRadius: '10px',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.greyhard,
    color: colors.white,
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  buttonIcon: {
    fontSize: '16px',
  },

  helpText: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '12px',
    backgroundColor: colors.yellow + '10',
    borderRadius: '10px',
    border: `1px solid ${colors.yellow}30`,
    flexShrink: 0,
  },

  helpIcon: {
    fontSize: '16px',
    marginTop: '1px',
  },

  helpMessage: {
    fontSize: '13px',
    color: colors.grey,
    margin: 0,
    lineHeight: '1.3',
  },

  quizList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    flex: 1,
    minHeight: 0,
    maxHeight: 'calc(100vh - 160px)', // Добавлено ограничение высоты
    overflowY: 'auto',
  },

  quizCard: {
    padding: '16px',
    backgroundColor: colors.bg,
    borderRadius: '10px',
    border: `1px solid ${colors.border}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0, // Предотвращает сжатие карточек
  },

  quizHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },

  quizNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: colors.yellow,
    color: colors.black,
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  quizTitle: {
    flex: 1,
    fontSize: '15px',
    fontWeight: '600',
    color: colors.white,
    margin: 0,
    lineHeight: '1.3',
    wordBreak: 'break-word', // Добавлено для длинных заголовков
  },

  quizActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },

  editButton: {
    height: '32px',
    padding: '0 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: colors.yellow + 'aa',
    color: colors.white,
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap', // Предотвращает перенос текста
  },

  deleteButton: {
    height: '32px',
    padding: '0 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: colors.red + 'dd',
    color: colors.white,
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap', // Предотвращает перенос текста
  },

  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  optionPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 10px',
    backgroundColor: colors.greyhard,
    borderRadius: '6px',
  },

  optionStatus: {
    fontSize: '14px',
    flexShrink: 0,
  },

  optionText: {
    fontSize: '13px',
    color: colors.white,
    lineHeight: '1.2',
    wordBreak: 'break-word', // Добавлено для длинных текстов
  },
}