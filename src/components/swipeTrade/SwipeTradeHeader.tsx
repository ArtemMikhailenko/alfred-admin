import React, { CSSProperties } from 'react'
import colors from '../../constants/colors'
import { Course, Language } from '../../constants/interfaces'
import globalStyles from '../../constants/globalStyles'
import { useNavigate } from 'react-router-dom'
import LanguageSelectorBlock from '../LanguageSelectorBlock'
import { styles } from './styles'

function CoursesHeader({
  onCreateQuiz,
  language,
  setLanguage,
}: {
  onCreateQuiz: () => void
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
        <p
          style={{
            ...globalStyles.title,
            color: colors.yellow,
            cursor: 'default',
          }}
        >
          Swipe Trade
        </p>
      </div>

      <div style={styles.row}>
        <button style={styles.button} onClick={onCreateQuiz}>
          Create New Quiz
        </button>
        <div style={{ flex: 1 }} />
        <LanguageSelectorBlock language={language} setLanguage={setLanguage} />
      </div>
    </>
  )
}

export default React.memo(CoursesHeader)
