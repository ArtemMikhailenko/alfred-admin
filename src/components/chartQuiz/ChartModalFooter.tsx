import React from 'react'
import styles from './ChartModalFooter.module.css'

interface ChartModalFooterProps {
  handleSave: () => void
  disabled: boolean
  handleCheckDescription: () => void
}

const ChartModalFooter: React.FC<ChartModalFooterProps> = ({
  handleSave,
  disabled,
  handleCheckDescription,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.spacer} />
      
      <div className={styles.buttonGroup}>
        <button
          className={`${styles.button} ${styles.secondaryButton}`}
          onClick={handleCheckDescription}
          type="button"
        >
          Check description
        </button>
        
        <button
          className={`${styles.button} ${styles.primaryButton} ${
            disabled ? styles.disabled : ''
          }`}
          onClick={handleSave}
          disabled={disabled}
          type="submit"
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default ChartModalFooter