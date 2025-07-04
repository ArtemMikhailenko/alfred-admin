import React from 'react'
import ReactECharts from 'echarts-for-react'
import { WagmiCandle } from './functions'

function CandlestickChart({
  candles,
  candlesFirstHalf,
  showFullChart,
}: {
  candles: WagmiCandle[]
  candlesFirstHalf: number
  showFullChart: boolean
}) {
  const firstPart = candles.slice(0, candlesFirstHalf)
  const secondPart = candles.slice(candlesFirstHalf)

  const option = {
    xAxis: {
      type: 'category',
      data: candles.map((c) =>
        new Date(c.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      ),
      axisLine: { lineStyle: { color: '#ccc' } },
    },
    yAxis: {
      scale: true,
      axisLine: { lineStyle: { color: '#ccc' } },
    },
    series: showFullChart
      ? [
          {
            type: 'candlestick',
            name: 'Full',
            data: candles.map((c) => [c.open, c.close, c.low, c.high]),
            itemStyle: {
              color: '#0f0',
              color0: '#f00',
              borderColor: '#0f0',
              borderColor0: '#f00',
            },
          },
        ]
      : [
          {
            type: 'candlestick',
            name: 'Visible',
            data: firstPart.map((c) => [c.open, c.close, c.low, c.high]),
            itemStyle: {
              color: '#0f0',
              color0: '#f00',
              borderColor: '#0f0',
              borderColor0: '#f00',
            },
          },
          {
            type: 'candlestick',
            name: 'Hidden',
            data: secondPart.map((c) => [c.open, c.close, c.low, c.high]),
            itemStyle: {
              color: 'transparent',
              color0: 'transparent',
              borderColor: 'transparent',
              borderColor0: 'transparent',
            },
          },
        ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '5%',
      containLabel: true,
    },
  }

  return (
    <ReactECharts
      option={option}
      style={{
        height: 400,
        width: '100%',
      }}
    />
  )
}

export default CandlestickChart
