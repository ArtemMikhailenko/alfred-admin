import { CSSProperties } from 'react'
import globalStyles from '../../constants/globalStyles'
import { Language } from '../../constants/interfaces'
import colors from '../../constants/colors'
import LanguageSelectorBlock from '../LanguageSelectorBlock'

export default function FinalTestModalHeader({
  chapter,
  handleClose,
  language,
  setLanguage,
}: {
  chapter: string
  handleClose: () => void
  language: Language
  setLanguage: (i: Language) => void
}) {
  return (
    <div style={globalStyles.rowBetween}>
      <p style={globalStyles.title}>Final test for {chapter}</p>
      <div style={{ flex: 1 }} />
      <LanguageSelectorBlock language={language} setLanguage={setLanguage} />
      <div style={{ flex: 1 }} />

      <button style={globalStyles.cancelButton} onClick={handleClose}>
        Cancel
      </button>
    </div>
  )
}
