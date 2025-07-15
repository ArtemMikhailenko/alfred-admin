import React from 'react'
import { Language } from '../../constants/interfaces'
import LanguageSelectorBlock from '../LanguageSelectorBlock'
import styles from './ChartModalHeader.module.css'

interface ChartModalHeaderProps {
  language: Language
  setLanguage: (language: Language) => void
  handleClose: () => void
}

const ChartModalHeader: React.FC<ChartModalHeaderProps> = ({
  language,
  setLanguage,
  handleClose,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.titleSection}>
        <h2 className={styles.title}>Create Chart Quiz</h2>
        <div className={styles.subtitle}>
          Configure your trading quiz parameters
        </div>
      </div>

      <div className={styles.spacer} />

      <div className={styles.controls}>
        <LanguageSelectorBlock 
          language={language} 
          setLanguage={setLanguage} 
        />
      </div>

      <div className={styles.spacer} />

      <button 
        className={styles.closeButton}
        onClick={handleClose}
        type="button"
        aria-label="Close modal"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none"
          className={styles.closeIcon}
        >
          <path 
            d="M15 5L5 15M5 5L15 15" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  )
}

export default ChartModalHeader