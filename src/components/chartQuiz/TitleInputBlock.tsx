import colors from '../../constants/colors'
import globalStyles from '../../constants/globalStyles'
import { CSSProperties } from 'react'

function TitleInputBlock({
  title,
  setTitle,
  isActive,
  setIsActive,
}: {
  title: string
  setTitle: (i: string) => void
  isActive: boolean
  setIsActive: (i: boolean) => void
}) {
  return (
    <div style={titleStyles.container}>
      <div style={titleStyles.inputSection}>
        <label style={titleStyles.label}>Quiz Title</label>
        <input
          type="text"
          placeholder='Enter title (pair + timeframe) example: "BTC/USDT 1min"'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            ...titleStyles.input,
            borderColor: title ? colors.yellow : colors.border,
            boxShadow: title ? `0 0 0 2px ${colors.yellow}20` : 'none',
          }}
        />
      </div>

      <div style={titleStyles.switchSection}>
        <label style={titleStyles.switchLabel}>Status</label>
        <div style={titleStyles.switchContainer}>
          <button
            onClick={() => setIsActive(!isActive)}
            style={{
              ...titleStyles.switch,
              backgroundColor: isActive ? colors.green : colors.red,
              boxShadow: isActive 
                ? `0 4px 12px ${colors.green}40, 0 0 20px ${colors.green}20` 
                : `0 4px 12px ${colors.red}40, 0 0 20px ${colors.red}20`,
            }}
            onMouseEnter={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.transform = 'scale(1.05)'
            }}
            onMouseLeave={(e) => {
              const target = e.target as HTMLButtonElement
              target.style.transform = 'scale(1)'
            }}
          >
            <div
              style={{
                ...titleStyles.switchThumb,
                transform: isActive ? 'translateX(32px)' : 'translateX(4px)',
              }}
            />
          </button>
          <div style={titleStyles.statusText}>
            <span style={{
              ...titleStyles.statusLabel,
              color: isActive ? colors.green : colors.red,
            }}>
              {isActive ? '● Active' : '● Inactive'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

const titleStyles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '24px',
    // marginBottom: '20px',
    // padding: '16px',
    // backgroundColor: colors.greyhard,
    borderRadius: '12px',
    // border: `1px solid ${colors.border}`,
    // boxShadow: `0 2px 8px ${colors.black}20`,
  },

  inputSection: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: '8px',
  },

  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.white,
    margin: 0,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },

  input: {
    height: '48px',
    padding: '12px 16px',
    fontSize: '16px',
    borderRadius: '10px',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.bg,
    color: colors.white,
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
  },

  switchSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
    minWidth: '120px',
  },

  switchLabel: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.white,
    margin: 0,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },

  switchContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },

  switch: {
    width: '58px',
    height: '30px',
    border: 'none',
    borderRadius: '20px',
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    outline: 'none',
    transform: 'scale(1)',
  },

  switchThumb: {
    width: '22px',
    height: '22px',
    backgroundColor: colors.white,
    borderRadius: '50%',
    position: 'absolute',
    top: '4px',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 2px 8px ${colors.black}30`,
  },

  statusText: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  statusLabel: {
    fontSize: '12px',
    fontWeight: '600',
    margin: 0,
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
    transition: 'color 0.3s ease',
  },
}

export default TitleInputBlock