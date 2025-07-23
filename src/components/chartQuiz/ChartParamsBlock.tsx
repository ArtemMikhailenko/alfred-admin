import React from 'react'
import { styles } from './styles'
import globalStyles from '../../constants/globalStyles'
import colors from '../../constants/colors'

export const intervalMap: Record<string, number> = {
  '1': 60_000,
  '3': 180_000,
  '5': 300_000,
  '30': 1_800_000,
  '60': 3_600_000,
  '120': 7_200_000,
  '360': 21_600_000,
  '720': 43_200_000,
  D: 86_400_000, // 1 day
  W: 604_800_000, // 1 week
  M: 2_592_000_000, // 1 month
}

export const intervals: { label: string; value: string }[] = [
  { label: '1 min', value: '1' },
  { label: '3 min', value: '3' },
  { label: '5 min', value: '5' },
  { label: '30 min', value: '30' },
  { label: '1 h', value: '60' },
  { label: '2 h', value: '120' },
  { label: '6 h', value: '360' },
  { label: '12 h', value: '720' },
  { label: '1 day ', value: 'D' },
  { label: '1 week', value: 'W' },
  { label: '1 month', value: 'M' },
]

export const symbols: { label: string; value: string }[] = [
  { label: 'BTC/USDT', value: 'BTCUSDT' },
  { label: 'ETH/USDT', value: 'ETHUSDT' },
  { label: 'SOL/USDT', value: 'SOLUSDT' },
  { label: 'XRP/USDT', value: 'XRPUSDT' },
  { label: 'DOGE/USDT', value: 'DOGEUSDT' },
  { label: 'BNB/USDT', value: 'BNBUSDT' },
  { label: 'AVAX/USDT', value: 'AVAXUSDT' },
  { label: 'ADA/USDT', value: 'ADAUSDT' },
  { label: 'MATIC/USDT', value: 'MATICUSDT' },
  { label: 'DOT/USDT', value: 'DOTUSDT' },
]

function ChartParamsBlock({
  timeframe,
  setTimeframe,
  symbol,
  setSymbol,
  onRequest,
  hasChanged,
}: {
  timeframe: string
  setTimeframe: (i: string) => void
  symbol: string
  setSymbol: (i: string) => void
  onRequest: () => void
  hasChanged: boolean
}) {
  return (
    <>
      <div style={{ ...styles.row, marginBottom: 8 }}>
        <div style={styles.column}>
          <p style={styles.chartInputTitle}>Timeframe</p>
          <select
            style={styles.chartInput}
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            {intervals.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.column}>
          <p style={styles.chartInputTitle}>Pair</p>
          <select
            style={styles.chartInput}
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
          >
            {symbols.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
        <button
          style={{
            ...globalStyles.submitButton,
            backgroundColor: hasChanged ? colors.yellow : colors.greyhard,
            cursor: hasChanged ? 'pointer' : 'default',
          }}
          onClick={onRequest}
          disabled={!hasChanged}
        >
          Make chart
        </button>
      </div>
    </>
  )
}

export default ChartParamsBlock