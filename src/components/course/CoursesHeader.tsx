import React, { CSSProperties } from 'react'
import colors from '../../constants/colors'
import globalStyles from '../../constants/globalStyles'
import LanguageSelectorBlock from '../LanguageSelectorBlock'
import { Language } from '../../constants/interfaces'
import { styles } from './styles'

function CoursesHeader({
  onCreateCourse,
  onOpenSwipeTrade,
  onCreateAdmin,
  language,
  setLanguage,
}: {
  onCreateCourse: () => void
  onOpenSwipeTrade: () => void
  onCreateAdmin: () => void
  language: Language
  setLanguage: (l: Language) => void
}) {
  return (
    <>
      <div style={{ ...globalStyles.rowStart, marginBottom: 10 }}>
        <p
          style={{
            ...globalStyles.title,
            color: colors.yellow,
            cursor: 'default',
          }}
        >
          Alfred Trade Admin{' '}
        </p>
      </div>
      <div style={styles.row}>
        <button style={styles.button} onClick={onCreateCourse}>
          Create New Course
        </button>
        <button style={globalStyles.editButton} onClick={onOpenSwipeTrade}>
          Swipe Trade
        </button>
        <button style={globalStyles.editButton} onClick={onCreateAdmin}>
          Add Admin
        </button>
        <div style={{ flex: 1 }} />
        <LanguageSelectorBlock language={language} setLanguage={setLanguage} />
      </div>
    </>
  )
}

export default React.memo(CoursesHeader)
