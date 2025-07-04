import { Language } from '../../constants/interfaces'
import { intervals } from './ChartParamsBlock'

export interface SwipeTradeQuizInterface {
  id: number
  title: string
  settings: {
    pair: string
    answer: Exclude<Answer, null>
    points: number
    endDate: string
    hideChart: boolean
    startDate: string
    timeframe: string
    itemsToShowFirst: number
  }
  candleData: WagmiCandle[]
  description: Record<Language, string>
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface WagmiCandle {
  timestamp: number // in milliseconds
  open: number
  high: number
  low: number
  close: number
}

export type Answer = 'Short' | 'Long' | null

export async function fetchBybitCandlestickData(
  symbol: string,
  startDate: Date,
  endDate: Date,
  limit: number,
  interval: string
): Promise<WagmiCandle[]> {
  const category = 'linear'

  const params = new URLSearchParams({
    category,
    symbol,
    interval,
    start: startDate.getTime().toString(),
    end: endDate.getTime().toString(),
    limit: limit.toString(),
  })

  const url = `https://api.bybit.com/v5/market/kline?${params.toString()}`

  const response = await fetch(url)
  const data = await response.json()

  if (!response.ok || data.retCode !== 0) {
    throw new Error(`Bybit API Error: ${data.retMsg || response.statusText}`)
  }

  return data.result.list
    .map((item: string[]) => ({
      timestamp: parseInt(item[0]),
      open: parseFloat(item[1]),
      high: parseFloat(item[2]),
      low: parseFloat(item[3]),
      close: parseFloat(item[4]),
    }))
    .reverse()
}

export function AnswerCheck(answer: Answer) {
  return answer !== null
}

export function PointsCheck(points: string) {
  return points && +points > 0
}

export function CandlesFirstHalfCheck(
  candlesFirstHalf: string,
  candleLength: number
) {
  return (
    candlesFirstHalf &&
    +candlesFirstHalf > 0 &&
    +candlesFirstHalf < candleLength
  )
}

export function TitleCheck(title: string) {
  return !!title.trim().length
}

export function DescriptionCheck(description: Record<Language, string>) {
  return Object.values(description).every((text) => text.trim().length > 0)
}

export function DataCheck(
  answer: Answer,
  points: string,
  candlesFirstHalf: string,
  candleLength: number,
  title: string,
  description: Record<Language, string>
) {
  return (
    AnswerCheck(answer) &&
    PointsCheck(points) &&
    CandlesFirstHalfCheck(candlesFirstHalf, candleLength) &&
    TitleCheck(title) &&
    DescriptionCheck(description)
  )
}

// "1" -> "1 min"
export function FormatIntervalLabel(value: string): string {
  const match = intervals.find((interval) => interval.value === value)
  return match ? match.label : value
}
// "1 min" -> "1"
export function FormatIntervalValue(label: string): string {
  const match = intervals.find((interval) => interval.label === label)
  return match ? match.value : label
}

// "2024-01-01T01:00" -> "01/01/2024, 01:00 AM"
export function FormatTime(time: string) {
  return new Date(time)
    .toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
    .replace(/\s(am|pm)/i, (match) => match.toUpperCase())
}

// "01/01/2024, 01:00 AM" -> "2024-01-01T01:00"
export function ParseDateTimeString(input: string): string {
  const [datePart, timePartRaw] = input.split(', ')
  const [day, month, year] = datePart.split('/').map(Number)

  const [time, ampm] = timePartRaw.split(' ')
  let [hour, minute] = time.split(':').map(Number)

  if (ampm.toUpperCase() === 'PM' && hour !== 12) hour += 12
  if (ampm.toUpperCase() === 'AM' && hour === 12) hour = 0

  const pad = (n: number) => String(n).padStart(2, '0')

  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`
}
