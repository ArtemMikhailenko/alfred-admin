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
import { styles } from './styles'

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
    <div style={styles.column}>
      {!newQuizBlock && (
        <div style={globalStyles.row}>
          <button
            style={styles.createButton}
            onClick={() => setNewQuizBlock(handleCreateQuiz(quiz))}
          >
            Create Quiz
          </button>
        </div>
      )}
      {newQuizBlock ? (
        <>
          <div style={styles.quizEditor}>
            <LanguageSelectorBlock
              language={localLanguage}
              setLanguage={setLocalLanguage}
            />
            <input
              type="text"
              placeholder="Enter quiz title"
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
              style={{ ...styles.input, marginTop: 10 }}
            />
            {newQuizBlock.options[localLanguage].map((b, index) => (
              <div key={index} style={styles.row}>
                <button
                  style={styles.answerButton}
                  onClick={() => {
                    if (newQuizBlock.correctAnswer[localLanguage].includes(b)) {
                      setNewQuizBlock(removeCorrectAnswer(index, newQuizBlock))
                    } else {
                      setNewQuizBlock(addCorrectAnswer(index, newQuizBlock))
                    }
                  }}
                >
                  {newQuizBlock.correctAnswer[localLanguage].includes(b)
                    ? '✅'
                    : '❌'}
                </button>
                <input
                  type="text"
                  placeholder="variant..."
                  value={b}
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
                  style={styles.input}
                />
                <button
                  style={styles.answerButton}
                  onClick={() =>
                    setNewQuizBlock(removeOption(index, newQuizBlock))
                  }
                >
                  🗑
                </button>
              </div>
            ))}
            <div style={styles.row}>
              <button
                style={styles.addButton}
                onClick={() => setNewQuizBlock(addOption(newQuizBlock))}
              >
                Add Option
              </button>
              <button style={styles.saveButton} onClick={handleSaveQuiz}>
                Save Quiz
              </button>
              <div style={{ flex: 1 }} />
              <button style={styles.cancelButton} onClick={handleCancelQuiz}>
                Cancel
              </button>
            </div>
          </div>
          <p style={{ ...globalStyles.comment, margin: 10 }}>
            Ideal usage scenario: first add and fill in the answer options and
            then mark the correct ones
          </p>
        </>
      ) : (
        <div style={styles.scroll}>
          {Array.isArray(quiz) &&
            quiz.map((q: Quiz, index: number) => (
              <div style={styles.quizItem} key={index}>
                <div style={styles.row}>
                  <p style={styles.quizItemTitle}>
                    {index + 1}. {q.question[language]}
                  </p>
                  <button
                    style={styles.editButton}
                    onClick={() => setNewQuizBlock({ index: index, ...q })}
                  >
                    Edit
                  </button>
                  <button
                    style={{
                      ...styles.editButton,
                      backgroundColor: colors.red,
                    }}
                    onClick={() => handleRemoveQuizItem(index)}
                  >
                    delete
                  </button>
                </div>
                {q.options[language].map((b: string, index: number) => (
                  <p style={styles.quizItemButton} key={index}>
                    {q.correctAnswer[language].includes(b) ? '✅ ' : '❌ '}
                    {b}
                  </p>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}
