import React from 'react'
import styles from './DatePickerBlock.module.css'

interface DatePickerBlockProps {
  startDate: string
  setStartDate: (date: string) => void
  endDate: string
  setEndDate: (date: string) => void
}

const DatePickerBlock: React.FC<DatePickerBlockProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="start-date">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            className={styles.labelIcon}
          >
            <path 
              d="M12.5 2.5H11V1.5C11 1.22386 10.7761 1 10.5 1C10.2239 1 10 1.22386 10 1.5V2.5H6V1.5C6 1.22386 5.77614 1 5.5 1C5.22386 1 5 1.22386 5 1.5V2.5H3.5C2.67157 2.5 2 3.17157 2 4V13C2 13.8284 2.67157 14.5 3.5 14.5H12.5C13.3284 14.5 14 13.8284 14 13V4C14 3.17157 13.3284 2.5 12.5 2.5Z" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
            <path d="M2 6.5H14" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          Start Date
        </label>
        <input
          id="start-date"
          className={styles.input}
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>

      <div className={styles.separator}>
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none"
          className={styles.separatorIcon}
        >
          <path 
            d="M5 12H19M19 12L12 5M19 12L12 19" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label} htmlFor="end-date">
          <svg 
            width="16" 
            height="16" 
            viewBox="0 0 16 16" 
            fill="none"
            className={styles.labelIcon}
          >
            <path 
              d="M12.5 2.5H11V1.5C11 1.22386 10.7761 1 10.5 1C10.2239 1 10 1.22386 10 1.5V2.5H6V1.5C6 1.22386 5.77614 1 5.5 1C5.22386 1 5 1.22386 5 1.5V2.5H3.5C2.67157 2.5 2 3.17157 2 4V13C2 13.8284 2.67157 14.5 3.5 14.5H12.5C13.3284 14.5 14 13.8284 14 13V4C14 3.17157 13.3284 2.5 12.5 2.5Z" 
              stroke="currentColor" 
              strokeWidth="1.5"
            />
            <path d="M2 6.5H14" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
          End Date
        </label>
        <input
          id="end-date"
          className={styles.input}
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  )
}

export default DatePickerBlock