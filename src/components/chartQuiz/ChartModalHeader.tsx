import { Language } from '../../constants/interfaces'
import LanguageSelectorBlock from '../LanguageSelectorBlock'
import globalStyles from '../../constants/globalStyles'
import colors from '../../constants/colors'
import { CSSProperties } from 'react'

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
    <div style={headerStyles.container}>
      <div style={headerStyles.titleSection}>
        <p style={headerStyles.title}>
          Create Chart Quiz
        </p>
        <p style={headerStyles.subtitle}>
          Configure trading chart parameters and quiz settings
        </p>
      </div>

      <div style={headerStyles.spacer} />

      <div style={headerStyles.controls}>
        <LanguageSelectorBlock language={language} setLanguage={setLanguage} />
        
        <button 
          style={headerStyles.closeButton} 
          onClick={handleClose}
          onMouseEnter={(e) => {
            const target = e.target as HTMLButtonElement
            Object.assign(target.style, headerStyles.closeButtonHover)
          }}
          onMouseLeave={(e) => {
            const target = e.target as HTMLButtonElement
            Object.assign(target.style, headerStyles.closeButton)
          }}
        >
          <span style={headerStyles.closeIcon}>×</span>
        </button>
      </div>
    </div>
  )
}

const headerStyles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 30px',
    marginBottom: '16px',
    borderBottom: `2px solid ${colors.border}`,
    gap: '16px',
    position: 'relative',
    background: `linear-gradient(135deg, ${colors.bg} 0%, ${colors.greyhard} 100%)`,
  },

  titleSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },

  title: {
    fontSize: '18px',
    fontWeight: '700',
    color: colors.white,
    margin: 0,
    letterSpacing: '-0.5px',
    textShadow: `0 2px 4px ${colors.black}40`,
  },

  subtitle: {
    fontSize: '14px',
    color: colors.grey,
    margin: 0,
    fontWeight: '500',
    opacity: 0.8,
  },

  spacer: {
    flex: 1,
  },

  controls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },

  closeButton: {
    width: '44px',
    height: '44px',
    border: `2px solid ${colors.border}`,
    borderRadius: '10px',
    backgroundColor: colors.greyhard,
    color: colors.grey,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: `0 2px 8px ${colors.black}20`,
  },

  closeButtonHover: {
    borderColor: colors.red,
    backgroundColor: colors.red,
    color: colors.white,
    transform: 'translateY(-2px)',
    boxShadow: `0 4px 12px ${colors.red}4D`,
  },

  closeIcon: {
    fontSize: '18px',
    fontWeight: 'bold',
    transition: 'transform 0.2s ease',
  },
}