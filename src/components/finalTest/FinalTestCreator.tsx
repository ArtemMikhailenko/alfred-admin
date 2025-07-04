import { useState } from 'react'
import { Chapter, FinalTest, Language, Quiz } from '../../constants/interfaces'
import QuizCreationBlock from '../quiz/QuizCreationBlock'
import FinalTestModalHeader from './FinalTestModalHeader'
import globalStyles from '../../constants/globalStyles'
import { PostFinalTest } from '../../actions/actions'

export default function FinalTestCreator({
  chapter,
  onClose,
  initialQuiz,
}: {
  chapter: Chapter | undefined
  onClose: (i: boolean) => void
  initialQuiz: FinalTest
}) {
  const [quiz, setQuiz] = useState<Quiz[]>(initialQuiz)
  const [language, setLanguage] = useState<Language>('ua')

  const handleSave = async () => {
    if (!chapter?.id) return
    const newQuiz = quiz.map((q: Quiz) => {
      return {
        options: q.options,
        correctAnswer: q.correctAnswer,
        question: q.question,
      }
    })
    const response = await PostFinalTest(newQuiz, chapter.id)
    onClose(false)
  }

  return (
    <div
      style={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
      }}
    >
      <FinalTestModalHeader
        chapter={chapter?.name[language] || ''}
        handleClose={() => {
          onClose(true)
        }}
        language={language}
        setLanguage={setLanguage}
      />
      <QuizCreationBlock quiz={quiz} setQuiz={setQuiz} language={language} />
      <button style={globalStyles.submitButton} onClick={handleSave}>
        Save
      </button>
    </div>
  )
}
