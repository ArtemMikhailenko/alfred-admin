import React from 'react'
import { Answer } from './functions'
import styles from './AnswerPickerBlock.module.css'

interface AnswerPickerBlockProps {
  answer: Answer
  setAnswer: (answer: Answer) => void
  candlesFirstHalf: string
  setCandlesFirstHalf: (value: string) => void
  candlesAmount: number
  showFullChart: boolean
  toggleShowFullChart: () => void
  points: string
  setPoints: (value: string) => void
}

const AnswerPickerBlock: React.FC<AnswerPickerBlockProps> = ({
  answer,
  setAnswer,
  candlesFirstHalf,
  setCandlesFirstHalf,
  candlesAmount,
  showFullChart,
  toggleShowFullChart,
  points,
  setPoints,
}) => {
  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (/^\d*$/.test(val)) {
      if (val === '') {
        setPoints('')
      } else {
        const num = parseInt(val, 10)
        setPoints(num.toString())
      }
    }
  }

  const handleCandlesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    if (/^\d*$/.test(val)) {
      if (val === '') {
        setCandlesFirstHalf('')
      } else {
        const num = parseInt(val, 10)
        const clamped = Math.max(0, Math.min(candlesAmount, num))
        setCandlesFirstHalf(clamped.toString())
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.column}>
        <p className={styles.label}>Answer</p>
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.answerButton} ${styles.shortButton} ${
              answer === 'Short' ? styles.active : ''
            }`}
            onClick={() => setAnswer('Short')}
          >
            Short
          </button>
          <button
            className={`${styles.answerButton} ${styles.longButton} ${
              answer === 'Long' ? styles.active : ''
            }`}
            onClick={() => setAnswer('Long')}
          >
            Long
          </button>
        </div>
      </div>

      <div className={styles.column}>
        <p className={styles.label}>Points</p>
        <input
          className={`${styles.input} ${styles.pointsInput}`}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={points}
          onChange={handlePointsChange}
          placeholder="Enter points"
        />
      </div>

      <div className={styles.column}>
        <p className={styles.label}>Items to show first</p>
        <input
          className={styles.input}
          type="text"
          inputMode="numeric"
          min={0}
          max={candlesAmount}
          value={candlesFirstHalf}
          pattern="[0-9]*"
          onChange={handleCandlesChange}
          placeholder="Enter count"
        />
      </div>

      <button className={styles.toggleButton} onClick={toggleShowFullChart}>
        {showFullChart ? 'Hide' : 'Show'} chart
      </button>
    </div>
  )
}

export default AnswerPickerBlock