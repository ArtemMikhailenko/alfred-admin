import React from 'react'
import ReactECharts from 'echarts-for-react'
import { WagmiCandle } from './functions'
import styles from './CandlestickChart.module.css'

interface CandlestickChartProps {
  candles: WagmiCandle[]
  candlesFirstHalf: number
  showFullChart: boolean
}

const CandlestickChart: React.FC<CandlestickChartProps> = ({
  candles,
  candlesFirstHalf,
  showFullChart,
}) => {
  const firstPart = candles.slice(0, candlesFirstHalf)
  const secondPart = candles.slice(candlesFirstHalf)

  const chartOptions = {
    backgroundColor: '#1f1f1f',
    xAxis: {
      type: 'category',
      data: candles.map((c) =>
        new Date(c.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      ),
      axisLine: { 
        lineStyle: { color: '#515155' },
        show: true 
      },
      axisLabel: { 
        color: '#9e9a9b',
        fontSize: 12 
      },
      splitLine: { 
        show: false 
      },
    },
    yAxis: {
      scale: true,
      axisLine: { 
        lineStyle: { color: '#515155' },
        show: true 
      },
      axisLabel: { 
        color: '#9e9a9b',
        fontSize: 12 
      },
      splitLine: { 
        lineStyle: { 
          color: '#333439',
          type: 'dashed' 
        } 
      },
    },
    series: showFullChart
      ? [
          {
            type: 'candlestick',
            name: 'Full Chart',
            data: candles.map((c) => [c.open, c.close, c.low, c.high]),
            itemStyle: {
              color: '#3cad3c',
              color0: '#b23c3c',
              borderColor: '#3cad3c',
              borderColor0: '#b23c3c',
              borderWidth: 1,
            },
            emphasis: {
              itemStyle: {
                borderWidth: 2,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 8,
              },
            },
          },
        ]
      : [
          {
            type: 'candlestick',
            name: 'Visible Part',
            data: firstPart.map((c) => [c.open, c.close, c.low, c.high]),
            itemStyle: {
              color: '#3cad3c',
              color0: '#b23c3c',
              borderColor: '#3cad3c',
              borderColor0: '#b23c3c',
              borderWidth: 1,
            },
            emphasis: {
              itemStyle: {
                borderWidth: 2,
                shadowColor: 'rgba(0, 0, 0, 0.3)',
                shadowBlur: 8,
              },
            },
          },
          {
            type: 'candlestick',
            name: 'Hidden Part',
            data: secondPart.map((c) => [c.open, c.close, c.low, c.high]),
            itemStyle: {
              color: 'transparent',
              color0: 'transparent',
              borderColor: 'transparent',
              borderColor0: 'transparent',
            },
            silent: true,
          },
        ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: '#f0b90b',
          width: 1,
        },
      },
      backgroundColor: '#262626',
      borderColor: '#515155',
      textStyle: {
        color: '#eaecef',
      },
      formatter: (params: any) => {
        const data = params[0]
        if (!data || !data.data) return ''
        
        const [open, close, low, high] = data.data
        return `
          <div style="padding: 8px;">
            <div style="font-weight: bold; margin-bottom: 4px;">${data.name}</div>
            <div>Open: ${open.toFixed(2)}</div>
            <div>Close: ${close.toFixed(2)}</div>
            <div>High: ${high.toFixed(2)}</div>
            <div>Low: ${low.toFixed(2)}</div>
          </div>
        `
      },
    },
    grid: {
      left: '3%',
      right: '3%',
      bottom: '10%',
      top: '5%',
      containLabel: true,
    },
    animation: true,
    animationDuration: 800,
    animationEasing: 'cubicOut',
  }

  return (
    <div className={styles.container}>
      <ReactECharts
        option={chartOptions}
        style={{
          height: '400px',
          width: '100%',
        }}
        opts={{
          renderer: 'canvas',
          // useDirtyRect: false,
        }}
      />
    </div>
  )
}

export default CandlestickChart