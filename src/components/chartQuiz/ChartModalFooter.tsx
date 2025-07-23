import colors from '../../constants/colors'
import { CSSProperties } from 'react'

export default function ChartModalFooter({
  handleSave,
  disabled,
  handleCheckDescription,
}: {
  handleSave: () => void
  disabled: boolean
  handleCheckDescription: () => void
}) {
  return (
    <div style={footerStyles.container}>
      <div style={footerStyles.spacer} />
      <div style={footerStyles.buttonGroup}>
        <button
          style={{
            ...footerStyles.button,
            ...footerStyles.secondaryButton,
          }}
          onClick={handleCheckDescription}
        >
          Check description
        </button>
        <button
          style={{
            ...footerStyles.button,
            ...footerStyles.primaryButton,
            backgroundColor: disabled ? colors.greyhard : colors.yellow,
            color: disabled ? colors.grey : colors.black,
            cursor: disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.6 : 1,
          }}
          onClick={handleSave}
          disabled={disabled}
        >
          Save
        </button>
      </div>
    </div>
  )
}

const footerStyles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '16px 0',
    gap: '12px',
  },

  spacer: {
    flex: 1,
  },

  buttonGroup: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },

  button: {
    padding: '12px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '120px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  secondaryButton: {
    backgroundColor: colors.grey,
    color: colors.white,
    border: `1px solid ${colors.border}`,
  },

  primaryButton: {
    fontWeight: '700',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
}