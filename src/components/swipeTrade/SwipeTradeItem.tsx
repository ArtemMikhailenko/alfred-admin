import React from 'react'
import globalStyles from '../../constants/globalStyles'
import { Language, LessonWithLanguages } from '../../constants/interfaces'
import colors from '../../constants/colors'
import { SwipeTradeQuizInterface } from '../chartQuiz/functions'

function SwipeTradeItem({
  quiz,
  handleEditQuiz,
  language,
  handleDeleteQuiz,
}: {
  quiz: SwipeTradeQuizInterface
  handleEditQuiz: (lesson: SwipeTradeQuizInterface) => void
  language: Language
  handleDeleteQuiz: (lesson: SwipeTradeQuizInterface) => void
}) {
  return (
    <div key={quiz.id} style={globalStyles.item}>
      <p style={globalStyles.title}>{quiz.id}.</p>
      <p style={globalStyles.titleFlex}>{quiz.title}</p>
      <p
        style={{
          ...globalStyles.title,
          color: quiz.isActive ? colors.green : colors.red,
        }}
      >
        •
      </p>

      <button
        style={globalStyles.editButton}
        onClick={() => handleEditQuiz(quiz)}
      >
        Edit
      </button>
      <button
        style={{
          ...globalStyles.cancelButton,
          width: 40,
          backgroundColor: colors.red,
        }}
        onClick={() => handleDeleteQuiz(quiz)}
      >
        🗑
      </button>
    </div>
  )
}

export default React.memo(SwipeTradeItem)
