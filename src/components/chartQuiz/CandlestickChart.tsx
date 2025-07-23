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

  // Принудительно пересчитываем min/max для правильного масштаба
  const allValues = candles.flatMap(c => [c.open, c.close, c.low, c.high])
  const minValue = Math.min(...allValues)
  const maxValue = Math.max(...allValues)
  const padding = (maxValue - minValue) * 0.1 // 10% отступ

  const option = {
    animation: false, // Отключаем анимацию для стабильности
    xAxis: {
      type: 'category',
      data: candles.map((c, index) =>
        showFullChart 
          ? new Date(c.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : index < candlesFirstHalf 
            ? new Date(c.timestamp).toLocaleTimeString([], {
                hour: '2-digit', 
                minute: '2-digit',
              })
            : '???'
      ),
      axisLine: { lineStyle: { color: '#ccc' } },
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      scale: true,
      min: minValue - padding,
      max: maxValue + padding,
      axisLine: { lineStyle: { color: '#ccc' } },
    },
    series: showFullChart
      ? [
          {
            type: 'candlestick',
            name: 'Full Chart',
            data: candles.map((c) => [c.open, c.close, c.low, c.high]),
            itemStyle: {
              color: '#00ff88',
              color0: '#ff4444',
              borderColor: '#00ff88',
              borderColor0: '#ff4444',
              borderWidth: 1,
            },
          },
        ]
      : [
          {
            type: 'candlestick',
            name: 'Visible Part',
            data: candles.map((c, index) => 
              index < candlesFirstHalf 
                ? [c.open, c.close, c.low, c.high]
                : [null, null, null, null] // null вместо transparent
            ),
            itemStyle: {
              color: '#00ff88',
              color0: '#ff4444', 
              borderColor: '#00ff88',
              borderColor0: '#ff4444',
              borderWidth: 1,
            },
          },
        ],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      formatter: function(params: any) {
        const dataIndex = params[0]?.dataIndex
        if (dataIndex >= 0 && dataIndex < candles.length) {
          const candle = candles[dataIndex]
          return `
            <div>
              <strong>${new Date(candle.timestamp).toLocaleString()}</strong><br/>
              Open: ${candle.open}<br/>
              High: ${candle.high}<br/>
              Low: ${candle.low}<br/>
              Close: ${candle.close}
            </div>
          `
        }
        return 'No data'
      }
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
      key={`${candles.length}-${candlesFirstHalf}-${showFullChart}`} // Принудительный rerender
      option={option}
      style={{
        height: '100%',
        width: '100%',
      }}
      notMerge={true} // Не мержим опции, а полностью перерисовываем
      lazyUpdate={false}
    />
  )
}

export default CandlestickChart