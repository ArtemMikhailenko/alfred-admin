import { CSSProperties } from 'react'
import { Language } from '../../constants/interfaces'
import LanguageSelectorBlock from '../LanguageSelectorBlock'
import { styles } from './styles'
import globalStyles from '../../constants/globalStyles'

export default function ChartModalHeader({
  language,
  setLanguage,
  handleClose,
}: {
  language: Language
  setLanguage: (i: Language) => void
  handleClose: () => void
}) {
  return (
    <>
      <div style={styles.rowHeader}>
        <p
          style={{
            ...globalStyles.title,
          }}
        >
          {'Create Chart Quiz'}
        </p>

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
