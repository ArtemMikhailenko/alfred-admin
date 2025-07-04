import colors from '../../constants/colors'
import { styles } from './styles'

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
    <div style={styles.rowFooter}>
      <div style={{ flex: 1 }} />
      <button
        style={{
          ...styles.buttonFooter,
          backgroundColor: colors.grey,
        }}
        onClick={handleCheckDescription}
      >
        Check description
      </button>
      <button
        style={{
          ...styles.buttonFooter,
          backgroundColor: disabled ? colors.greyhard : colors.yellow,
        }}
        onClick={handleSave}
        disabled={disabled}
      >
        Save
      </button>
    </div>
  )
}
