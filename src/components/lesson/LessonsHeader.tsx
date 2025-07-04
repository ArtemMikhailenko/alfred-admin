import React, { CSSProperties } from 'react'
import colors from '../../constants/colors'
import { Course, Chapter, Language } from '../../constants/interfaces'
import globalStyles from '../../constants/globalStyles'
import { useNavigate } from 'react-router-dom'
import LanguageSelectorBlock from '../LanguageSelectorBlock'
import { styles } from './styles'

function LessonsHeader({
  onCreateLesson,
  parentCourse,
  parentChapter,
  onCreateFinalTest,
  language,
  setLanguage,
}: {
  onCreateLesson: () => void
  parentCourse: Course | undefined
  parentChapter: Chapter | undefined
  onCreateFinalTest: () => void
  language: Language
  setLanguage: (l: Language) => void
}) {
  const navigate = useNavigate()

  return (
    <>
      <div style={{ ...globalStyles.rowStart, marginBottom: 10 }}>
        <p
          style={{
            ...globalStyles.title,
            color: colors.yellow,
            cursor: 'pointer',
          }}
          onClick={() => navigate('/admin')}
        >
          Alfred Trade Admin{' '}
        </p>
      </div>
      <div style={{ ...globalStyles.rowStart, marginBottom: 10 }}>
        <p style={globalStyles.comment}>Course: </p>
        <p
          style={{
            ...globalStyles.title,
            color: colors.yellow,
            cursor: 'pointer',
          }}
          onClick={() => navigate(`/course/${parentCourse?.id}`)}
        >
          {parentCourse?.name[language]}
        </p>
      </div>
      <div style={{ ...globalStyles.rowStart, marginBottom: 10 }}>
        <p style={globalStyles.comment}>Chapter: </p>
        <p
          style={{
            ...globalStyles.title,
            color: colors.yellow,
            cursor: 'default',
          }}
        >
          {parentChapter?.name[language]}
        </p>
      </div>

      <div style={styles.row}>
        <button style={styles.button} onClick={onCreateLesson}>
          Create New Lesson
        </button>
        <button style={styles.button} onClick={onCreateFinalTest}>
          {parentChapter?.finalTest?.length ? 'Edit' : 'Create'} Final Test
        </button>
        <div style={{ flex: 1 }} />
        <LanguageSelectorBlock language={language} setLanguage={setLanguage} />
      </div>
    </>
  )
}

export default React.memo(LessonsHeader)
