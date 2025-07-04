import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import styles from './LanguageSelectorBlock.module.css'
import { Language, languagesList } from '../../constants/interfaces'

interface LanguageSelectorProps {
  language: Language
  setLanguage: (l: Language) => void
}

const languageLabels: Record<Language, string> = {
  ua: 'Українська',
  en: 'English',
  ru: 'Русский'
}

const languageFlags: Record<Language, string> = {
  ua: '🇺🇦',
  en: '🇺🇸',
  ru: '🇷🇺'
}

const LanguageSelectorBlock: React.FC<LanguageSelectorProps> = ({
  language,
  setLanguage,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLanguageSelect = (lang: Language) => {
    setLanguage(lang)
    setIsOpen(false)
  }

  return (
    <div className={styles.languageSelector} ref={dropdownRef}>
      <button
        className={styles.languageTrigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe size={16} />
        <span className={styles.languageFlag}>{languageFlags[language]}</span>
        <span className={styles.languageCode}>{language.toUpperCase()}</span>
        <ChevronDown 
          size={14} 
          className={`${styles.languageChevron} ${isOpen ? styles.open : ''}`}
        />
      </button>

      {isOpen && (
        <div className={styles.languageDropdown}>
          {languagesList.map((lang) => (
            <button
              key={lang}
              className={`${styles.languageOption} ${language === lang ? styles.active : ''}`}
              onClick={() => handleLanguageSelect(lang)}
            >
              <span className={styles.languageFlag}>{languageFlags[lang]}</span>
              <div className={styles.languageInfo}>
                <span className={styles.languageName}>{languageLabels[lang]}</span>
                <span className={styles.languageCodeSmall}>{lang.toUpperCase()}</span>
              </div>
              {language === lang && (
                <div className={styles.languageCheck}>✓</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}


export default LanguageSelectorBlock