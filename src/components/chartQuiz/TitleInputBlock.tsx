import { styles } from './styles'
import colors from '../../constants/colors'
import globalStyles from '../../constants/globalStyles'

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
    <div style={{ ...styles.row, alignItems: 'center' }}>
      <input
        type="text"
        placeholder='Enter title (pait + timeframe) example: "BTC/USDT 1min"'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <button
          onClick={() => setIsActive(!isActive)}
          style={{
            ...styles.switch,
            backgroundColor: isActive ? colors.green : colors.red,
            flexDirection: isActive ? 'row' : 'row-reverse',
          }}
        >
          <div
            style={{
              height: 32,
              aspectRatio: 1,
              backgroundColor: colors.white,
              borderRadius: 20,
            }}
          />
        </button>
        <p style={globalStyles.comment}>Active</p>
      </div>
    </div>
  )
}

export default TitleInputBlock
