import React from 'react'
import styles from './ChartParamsBlock.module.css'

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
  { label: '1 day', value: 'D' },
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

interface ChartParamsBlockProps {
  timeframe: string
  setTimeframe: (timeframe: string) => void
  symbol: string
  setSymbol: (symbol: string) => void
  onRequest: () => void
  hasChanged: boolean
}

const ChartParamsBlock: React.FC<ChartParamsBlockProps> = ({
  timeframe,
  setTimeframe,
  symbol,
  setSymbol,
  onRequest,
  hasChanged,
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.inputGroup}>
        <label className={styles.label}>Timeframe</label>
        <select
          className={styles.select}
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
        >
          {intervals.map((interval) => (
            <option key={interval.value} value={interval.value}>
              {interval.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.label}>Trading Pair</label>
        <select
          className={styles.select}
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        >
          {symbols.map((symbolOption) => (
            <option key={symbolOption.value} value={symbolOption.value}>
              {symbolOption.label}
            </option>
          ))}
        </select>
      </div>

      <button
        className={`${styles.generateButton} ${
          hasChanged ? styles.active : styles.disabled
        }`}
        onClick={onRequest}
        disabled={!hasChanged}
        type="button"
      >
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 20 20" 
          fill="none"
          className={styles.buttonIcon}
        >
          <path 
            d="M13.5 3L16 5.5M4.5 16.5L16 5L15 4L3.5 15.5L4.5 16.5Z" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
        </svg>
        Generate Chart
      </button>
    </div>
  )
}

export default ChartParamsBlock