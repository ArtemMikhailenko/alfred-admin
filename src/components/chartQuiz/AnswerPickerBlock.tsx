import globalStyles from '../../constants/globalStyles'
import colors from '../../constants/colors'
import { Answer } from './functions'
import { CSSProperties } from 'react'

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
    <div style={answerStyles.container}>
      {/* Answer Selection */}
      <div style={answerStyles.section}>
        <div style={answerStyles.sectionHeader}>
          <h4 style={answerStyles.sectionTitle}>Trading Direction</h4>
          <div style={answerStyles.badge}>
            {answer ? (
              <span style={{ 
                ...answerStyles.badgeText, 
                color: answer === 'Long' ? colors.green : colors.red 
              }}>
                {answer}
              </span>
            ) : (
              <span style={{ ...answerStyles.badgeText, color: colors.grey }}>
                Not selected
              </span>
            )}
          </div>
        </div>
        
        <div style={answerStyles.buttonGroup}>
          <button
            style={{
              ...answerStyles.answerButton,
              backgroundColor: answer === 'Short' ? colors.red50 : 'transparent',
              borderColor: colors.red,
              color: answer === 'Short' ? colors.white : colors.red,
              borderWidth: '2px',
            }}
            onClick={() => setAnswer('Short')}
          >
            <span style={answerStyles.buttonIcon}>↓</span>
            Short
          </button>
          <button
            style={{
              ...answerStyles.answerButton,
              backgroundColor: answer === 'Long' ? colors.green40 : 'transparent',
              borderColor: colors.green,
              color: answer === 'Long' ? colors.white : colors.green,
              borderWidth: '2px',
            }}
            onClick={() => setAnswer('Long')}
          >
            <span style={answerStyles.buttonIcon}>↑</span>
            Long
          </button>
        </div>
      </div>

      {/* Points and Chart Controls */}
      <div style={answerStyles.controlsGrid}>
        <div style={answerStyles.inputGroup}>
          <label style={answerStyles.label}>Points Reward</label>
          <input
            style={{
              ...answerStyles.input,
              color: colors.yellow,
              fontWeight: '600',
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
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

        <div style={answerStyles.inputGroup}>
          <label style={answerStyles.label}>
            Items to Show First 
            <span style={answerStyles.hint}>
              (of {candlesAmount} total)
            </span>
          </label>
          <input
            style={answerStyles.input}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="0"
            value={candlesFirstHalf}
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
      </div>

      {/* Chart Toggle */}
      <div style={answerStyles.chartToggle}>
        <button
          style={{
            ...answerStyles.toggleButton,
            backgroundColor: showFullChart ? colors.yellow : colors.greyhard,
            color: showFullChart ? colors.black : colors.white,
          }}
          onClick={toggleShowFullChart}
        >
          <span style={answerStyles.toggleIcon}>
            {showFullChart ? '👁️' : '👁️‍🗨️'}
          </span>
          {showFullChart ? 'Hide Full Chart' : 'Show Full Chart'}
        </button>
      </div>
    </div>
  )
}

const answerStyles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    padding: '20px',
    backgroundColor: colors.greyhard,
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
  },

  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.white,
    margin: 0,
  },

  badge: {
    padding: '4px 10px',
    borderRadius: '16px',
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
  },

  badgeText: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  buttonGroup: {
    display: 'flex',
    gap: '12px',
  },

  answerButton: {
    flex: 1,
    height: '48px',
    borderRadius: '8px',
    border: '2px solid',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },

  buttonIcon: {
    fontSize: '18px',
    fontWeight: 'bold',
  },

  controlsGrid: {
    display: 'flex',
    gap: '16px',
  },

  inputGroup: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },

  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.grey,
    margin: 0,
  },

  hint: {
    fontSize: '12px',
    color: colors.placeholder,
    fontWeight: '400',
  },

  input: {
    height: '40px',
    padding: '0 12px',
    borderRadius: '8px',
    border: `1px solid ${colors.border}`,
    backgroundColor: colors.bg,
    color: colors.white,
    fontSize: '16px',
    fontWeight: '500',
    outline: 'none',
    transition: 'border-color 0.2s ease',
  },

  chartToggle: {
    display: 'flex',
    justifyContent: 'center',
  },

  toggleButton: {
    height: '40px',
    padding: '0 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
  },

  toggleIcon: {
    fontSize: '16px',
  },
}

export default AnswerPickerBlock