import React from 'react'
import { styles } from './styles'

function DatePickerBlock({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
}: {
  startDate: string
  setStartDate: (i: string) => void
  endDate: string
  setEndDate: (i: string) => void
}) {
  return (
    <div style={{ ...styles.row, marginBottom: 8 }}>
      <div style={styles.column}>
        <p style={styles.chartInputTitle}>Start date</p>
        <input
          style={styles.chartInput}
          type="datetime-local"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
      </div>
      <div style={styles.column}>
        <p style={styles.chartInputTitle}>End date</p>
        <input
          style={styles.chartInput}
          type="datetime-local"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
    </div>
  )
}

export default DatePickerBlock