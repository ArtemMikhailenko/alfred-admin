import { CSSProperties } from 'react'
import { Language, Page } from '../constants/interfaces'
import colors from '../constants/colors'
import globalStyles from '../constants/globalStyles'
import LanguageSelectorBlock from './LanguageSelectorBlock'
import { styles } from './styles'

export default function ModalHeader({
  page,
  setPage,
  language,
  setLanguage,
  handleClose,
  isEdit,
}: {
  page: Page
  setPage: (i: Page) => void
  language: Language
  setLanguage: (i: Language) => void
  handleClose: () => void
  isEdit: boolean
}) {
  return (
    <>
      <div style={styles.rowHeader}>
        <p
          style={{
            ...globalStyles.title,
          }}
        >
          {isEdit ? 'Edit lesson' : 'Create lesson'}
        </p>
        <button
          style={{
            ...styles.buttonHeader,
            backgroundColor: page === 'theory' ? colors.white : colors.greyhard,
            color: page === 'theory' ? colors.black : colors.grey,
          }}
          onClick={() => setPage('theory')}
        >
          theory
        </button>
        <button
          style={{
            ...styles.buttonHeader,
            backgroundColor: page === 'quiz' ? colors.white : colors.greyhard,
            color: page === 'quiz' ? colors.black : colors.grey,
          }}
          onClick={() => setPage('quiz')}
        >
          quiz
        </button>
        <div style={{ flex: 1 }} />

        <LanguageSelectorBlock language={language} setLanguage={setLanguage} />
        <div style={{ flex: 1 }} />
        <button style={styles.buttonHeader} onClick={handleClose}>
          x
        </button>
      </div>
    </>
  )
}
