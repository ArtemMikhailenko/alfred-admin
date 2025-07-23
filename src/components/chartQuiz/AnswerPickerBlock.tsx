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
       {/* Chart Toggle */}
       <div style={answerStyles.chartToggle}>
        <button
          style={{
            ...answerStyles.toggleButton,
            backgroundColor: showFullChart ? colors.yellow : colors.greyhard,
            color: showFullChart ? colors.black : colors.white,
            boxShadow: showFullChart ? `0 4px 12px ${colors.yellow}30` : 'none',
          }}
          onClick={toggleShowFullChart}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            if (showFullChart) {
              e.currentTarget.style.boxShadow = `0 6px 16px ${colors.yellow}40`
            } else {
              e.currentTarget.style.backgroundColor = colors.greyhard + 'dd'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            if (showFullChart) {
              e.currentTarget.style.boxShadow = `0 4px 12px ${colors.yellow}30`
            } else {
              e.currentTarget.style.backgroundColor = colors.greyhard
            }
          }}
        >
          <span style={answerStyles.toggleIcon}>
            {showFullChart ? '🔍' : '👁️'}
          </span>
          {showFullChart ? 'Hide Full Chart' : 'Show Full Chart'}
        </button>
      </div>
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
              ...(answer === 'Short' ? answerStyles.shortButtonActive : answerStyles.shortButton),
            }}
            onClick={() => setAnswer('Short')}
            onMouseEnter={(e) => {
              if (answer !== 'Short') {
                e.currentTarget.style.backgroundColor = colors.red + '20'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (answer !== 'Short') {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            <span style={answerStyles.buttonIcon}>📉</span>
            Short
          </button>
          <button
            style={{
              ...answerStyles.answerButton,
              ...(answer === 'Long' ? answerStyles.longButtonActive : answerStyles.longButton),
            }}
            onClick={() => setAnswer('Long')}
            onMouseEnter={(e) => {
              if (answer !== 'Long') {
                e.currentTarget.style.backgroundColor = colors.green + '20'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseLeave={(e) => {
              if (answer !== 'Long') {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.transform = 'translateY(0)'
              }
            }}
          >
            <span style={answerStyles.buttonIcon}>📈</span>
            Long
          </button>
        </div>
      </div>

      {/* Points and Chart Controls */}
      <div style={answerStyles.controlsGrid}>
        <div style={answerStyles.inputGroup}>
          <label style={answerStyles.label}>
            <span style={answerStyles.labelIcon}>🎯</span>
            Points Reward
          </label>
          <input
            style={{
              ...answerStyles.input,
              ...answerStyles.pointsInput,
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Enter points..."
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
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.yellow
              e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.yellow}20`
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>

        <div style={answerStyles.inputGroup}>
          <label style={answerStyles.label}>
            <span style={answerStyles.labelIcon}>📊</span>
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
            placeholder="Enter amount..."
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
            onFocus={(e) => {
              e.currentTarget.style.borderColor = colors.yellow
              e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.yellow}20`
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = colors.border
              e.currentTarget.style.boxShadow = 'none'
            }}
          />
        </div>
      </div>

     
    </div>
  )
}

const answerStyles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    padding: '24px',
    backgroundColor: colors.greyhard,
    borderRadius: '16px',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    backdropFilter: 'blur(10px)',
  },

  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },

  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: colors.white,
    margin: 0,
    letterSpacing: '-0.02em',
  },

  badge: {
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: colors.bg,
    border: `1px solid ${colors.border}`,
    backdropFilter: 'blur(8px)',
  },

  badgeText: {
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  buttonGroup: {
    display: 'flex',
    gap: '16px',
  },

  answerButton: {
    flex: 1,
    height: '56px',
    borderRadius: '12px',
    border: '2px solid',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  },

  shortButton: {
    borderColor: colors.red,
    color: colors.red,
  },

  shortButtonActive: {
    backgroundColor: colors.red,
    borderColor: colors.red,
    color: colors.white,
    boxShadow: `0 4px 16px ${colors.red}40`,
  },

  longButton: {
    borderColor: colors.green,
    color: colors.green,
  },

  longButtonActive: {
    backgroundColor: colors.green,
    borderColor: colors.green,
    color: colors.white,
    boxShadow: `0 4px 16px ${colors.green}40`,
  },

  buttonIcon: {
    fontSize: '20px',
    fontWeight: 'normal',
  },

  controlsGrid: {
    display: 'flex',
    gap: '20px',
    flexWrap: 'wrap',
  },

  inputGroup: {
    flex: 1,
    minWidth: '200px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },

  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.grey,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },

  labelIcon: {
    fontSize: '14px',
  },

  hint: {
    fontSize: '12px',
    color: colors.placeholder,
    fontWeight: '400',
    marginLeft: '4px',
  },

  input: {
    height: '48px',
    padding: '0 16px',
    borderRadius: '12px',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.bg,
    color: colors.white,
    fontSize: '16px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  pointsInput: {
    color: colors.yellow,
    fontWeight: '700',
    fontSize: '18px',
  },

  chartToggle: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '8px',
  },

  toggleButton: {
    height: '48px',
    padding: '0 24px',
    borderRadius: '12px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    letterSpacing: '-0.01em',
  },

  toggleIcon: {
    fontSize: '18px',
  },
}

export default AnswerPickerBlock