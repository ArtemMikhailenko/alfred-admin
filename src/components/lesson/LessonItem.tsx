import React from 'react'
import globalStyles from '../../constants/globalStyles'
import { Language, LessonWithLanguages } from '../../constants/interfaces'
import colors from '../../constants/colors'

function LessonItem({
  lesson,
  handleEditLesson,
  language,
  handleDeleteLesson,
}: {
  lesson: LessonWithLanguages
  handleEditLesson: (lesson: LessonWithLanguages) => void
  language: Language
  handleDeleteLesson: (lesson: LessonWithLanguages) => void
}) {
  return (
    <div key={lesson.id} style={globalStyles.item}>
      <p style={globalStyles.title}>{lesson.id}.</p>
      <p style={globalStyles.titleFlex}>{lesson.name[language]}</p>
      <button
        style={globalStyles.editButton}
        onClick={() => handleEditLesson(lesson)}
      >
        Edit
      </button>
      <button
        style={{
          ...globalStyles.cancelButton,
          width: 40,
          backgroundColor: colors.red,
        }}
        onClick={() => handleDeleteLesson(lesson)}
      >
        🗑
      </button>
    </div>
  )
}

export default React.memo(LessonItem)
