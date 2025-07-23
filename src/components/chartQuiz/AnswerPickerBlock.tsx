import globalStyles from '../../constants/globalStyles'
import colors from '../../constants/colors'
import { styles } from './styles'
import { Answer } from './functions'

function AnswerPickerBlock({
  answer,
  setAnswer,
  candlesFirstHalf,
  setCandlesFirstHalf,
  candlesAmount,
  showFullChart,
  toggleShowFullChart,
  points,
  setPoints,
}: {
  answer: Answer
  setAnswer: (i: Answer) => void
  candlesFirstHalf: string
  setCandlesFirstHalf: (i: string) => void
  candlesAmount: number
  showFullChart: boolean
  toggleShowFullChart: () => void
  points: string
  setPoints: (i: string) => void
}) {
  return (
    <div style={{ ...styles.row, marginBottom: 8 }}>
      <div style={styles.column}>
        <p style={styles.chartInputTitle}>Answer</p>
        <div style={styles.row}>
          <button
            style={{
              ...globalStyles.submitButton,
              backgroundColor:
                answer === 'Short' ? colors.red50 : 'transparent',
              borderStyle: 'solid',
              borderWidth: answer === 'Short' ? 1 : 0,
              borderColor: colors.red,
              color: colors.red,
              flex: 1,
            }}
            onClick={() => {
              setAnswer('Short')
            }}
          >
            Short
          </button>
          <button
            style={{
              ...globalStyles.submitButton,
              backgroundColor:
                answer === 'Long' ? colors.green40 : 'transparent',
              borderStyle: 'solid',
              borderWidth: answer === 'Long' ? 1 : 0,
              borderColor: colors.green,
              color: colors.green,
              flex: 1,
            }}
            onClick={() => {
              setAnswer('Long')
            }}
          >
            Long
          </button>
        </div>
      </div>
      <div style={styles.column}>
        <p style={styles.chartInputTitle}>Points</p>
        <input
          style={{ ...styles.chartInput, color: colors.yellow }}
          type="text" // ← change to text for better control
          inputMode="numeric" // ← still brings up number keyboard on mobile
          pattern="[0-9]*"
          value={points}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value
            if (/^\d*$/.test(val)) {
              if (val === '') {
                setPoints('')
              } else {
                const num = parseInt(val, 10)
                setPoints(num.toString())
              }
            }
          }}
        />
      </div>
      <div style={styles.column}>
        <p style={styles.chartInputTitle}>Items to show first</p>
        <input
          style={styles.chartInput}
          type="text"
          inputMode="numeric" // ← still brings up number keyboard on mobile
          min={0}
          max={candlesAmount}
          value={candlesFirstHalf}
          pattern="[0-9]*"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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
          }}
        />
      </div>
      <button style={globalStyles.editButton} onClick={toggleShowFullChart}>
        {showFullChart ? 'Hide' : 'Show'} chart
      </button>
    </div>
  )
}

export default AnswerPickerBlock