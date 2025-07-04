import { CSSProperties } from 'react'
import colors from '../constants/colors'
import { Language, languagesList } from '../constants/interfaces'

export default function LanguageSelectorBlock({
  language,
  setLanguage,
}: {
  language: Language
  setLanguage: (l: Language) => void
}) {
  return (
    <div style={styles.row}>
      {languagesList.map((l: Language) => (
        <button
          key={l}
          style={{
            ...styles.button,
            backgroundColor: language === l ? colors.white : colors.greyhard,
            color: language === l ? colors.black : colors.grey,
          }}
          onClick={() => setLanguage(l)}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

const styles: { [key: string]: CSSProperties } = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    height: 40,
  },

  button: {
    paddingRight: 20,
    paddingLeft: 20,
    height: '100%',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 16,
    color: colors.black,
    backgroundColor: colors.red,
  },
}
