import { useCallback, useState } from 'react'
import ChartModalHeader from './ChartModalHeader'
import { Language, languagesObjString } from '../../constants/interfaces'
import ChartModalFooter from './ChartModalFooter'
import CandlestickChart from './CandlestickChart'
import AnswerPickerBlock from './AnswerPickerBlock'
import DatePickerBlock from './DatePickerBlock'
import ChartParamsBlock, { intervalMap } from './ChartParamsBlock'
import {
  Answer,
  AnswerCheck,
  CandlesFirstHalfCheck,
  DataCheck,
  DescriptionCheck,
  fetchBybitCandlestickData,
  FormatIntervalLabel,
  FormatIntervalValue,
  FormatTime,
  ParseDateTimeString,
  PointsCheck,
  SwipeTradeQuizInterface,
  TitleCheck,
  WagmiCandle,
} from './functions'
import TitleInputBlock from './TitleInputBlock'
import {
  PostSwipeTrade,
  UpdateSwipeTrade,
} from '../../actions/actions'
import { TokensState } from '../../redux/tokens'
import { useDispatch } from 'react-redux'
import DescriptionPreview from './DescriptionPreview'
import DescriptionInput from './DescriptionInput'
import { ReloginAndRetry } from '../ReloginAndRetry'
import colors from '../../constants/colors'
import { CSSProperties } from 'react'

const CreateChartQuizModal = ({
  initialValue,
  onClose,
  tokens,
}: {
  initialValue: SwipeTradeQuizInterface | null
  onClose: (isUpdated: boolean) => void
  tokens: TokensState
}) => {
  const dispatch = useDispatch()
  const [language, setLanguage] = useState<Language>('ua')

  const [isActive, setIsActive] = useState<boolean>(
    initialValue ? initialValue?.isActive : true
  )
  const [title, setTitle] = useState<string>(initialValue?.title || '')
  const [description, setDescription] = useState<Record<Language, string>>(
    initialValue?.description || languagesObjString
  )

  const [symbol, setSymbol] = useState(initialValue?.settings.pair || 'BTCUSDT')
  const [startDate, setStartDate] = useState<string>(
    initialValue?.settings.startDate
      ? ParseDateTimeString(initialValue?.settings.startDate)
      : '2024-01-01T00:00'
  )
  const [endDate, setEndDate] = useState<string>(
    initialValue?.settings.endDate
      ? ParseDateTimeString(initialValue?.settings.endDate)
      : '2024-01-01T01:00'
  )
  const [timeframe, setTimeframe] = useState<string>(
    initialValue?.settings.timeframe
      ? FormatIntervalValue(initialValue?.settings.timeframe)
      : '1'
  )

  const [candles, setCandles] = useState<WagmiCandle[]>(
    initialValue?.candleData || []
  )

  const [answer, setAnswer] = useState<Answer>(
    initialValue?.settings.answer || null
  )
  const [candlesFirstHalf, setCandlesFirstHalf] = useState<string>(
    initialValue?.settings.itemsToShowFirst.toString() || '0'
  )
  const [showFullChart, setShowFullChart] = useState<boolean>(true)
  const [points, setPoints] = useState<string>(
    initialValue?.settings.points.toString() || '0'
  )
  const [hasChanged, setHasChanged] = useState<boolean>(
    initialValue?.id ? false : true
  )
  const [checkDescription, setCheckDescription] = useState<boolean>(false)

  const handleClose = () => {
    onClose(true)
  }

  const bybitRequest = async () => {
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const intervalMs = intervalMap[timeframe]

      if (start.getTime() > end.getTime()) {
        alert('Invalid time input')
        return
      }
      if (!intervalMs || end.getTime() - start.getTime() < intervalMs) {
        alert('Invalid timeframe')
        return
      }

      const limit = Math.floor((end.getTime() - start.getTime()) / intervalMs)

      if (limit > 1000) {
        alert(`Will only render the first 1000 candles out of ${limit}`)
      }
      setCandlesFirstHalf((Math.min(limit, 1000) / 2).toString())
      const half = Math.floor(Math.min(limit, 1000) / 2)
      setCandlesFirstHalf(Math.max(1, Math.min(half, limit - 1)).toString())

      const data = await fetchBybitCandlestickData(
        symbol,
        start,
        end,
        limit,
        timeframe
      )

      setCandles(data)
      setHasChanged(false)
    } catch (err: any) {
      console.error(err.message)
      alert('Failed to fetch chart data. Please try again.')
    }
  }

  async function handleSave() {
    if (!(tokens.accessToken && tokens.email)) return

    if (hasChanged) {
      alert('Please generate the chart first before saving')
      return
    }

    if (
      !DataCheck(
        answer,
        points,
        candlesFirstHalf,
        candles.length,
        title,
        description
      )
    ) {
      alert(
        `Please fill all required fields properly:${
          !TitleCheck(title) ? '\n• Title must be non-empty' : ''
        }${
          !DescriptionCheck(description)
            ? '\n• Description must be non-empty in every language'
            : ''
        }${!AnswerCheck(answer) ? '\n• Answer must be selected' : ''}${
          !PointsCheck(points) ? '\n• Points must be greater than 0' : ''
        }${
          !CandlesFirstHalfCheck(candlesFirstHalf, candles.length)
            ? '\n• Amount of items to show first must be between 0 and chart length'
            : ''
        }`
      )
      return
    }

    const data = {
      title,
      settings: {
        timeframe: FormatIntervalLabel(timeframe),
        pair: symbol,
        startDate: FormatTime(startDate),
        endDate: FormatTime(endDate),
        answer,
        points: +points,
        itemsToShowFirst: +candlesFirstHalf,
        hideChart: false,
      },
      candleData: candles,
      description: description,
      isActive,
    }

    const trySubmit = async (accessToken: string): Promise<boolean> => {
      const response = initialValue?.id
        ? await UpdateSwipeTrade(initialValue.id, data, accessToken)
        : await PostSwipeTrade(data, accessToken)

      if (response.error) return false

      onClose(false)
      return true
    }

    const success = await trySubmit(tokens.accessToken)
    if (!success) {
      await ReloginAndRetry(tokens.email, dispatch, trySubmit)
    }
  }

  const updateText = useCallback(
    (newText: string) => {
      setDescription((prev) => ({
        ...prev,
        [language]: newText,
      }))
    },
    [language]
  )

  const updateStartDate = useCallback((date: string) => {
    setStartDate(date)
    setHasChanged(true)
  }, [])

  const updateEndDate = useCallback((date: string) => {
    setEndDate(date)
    setHasChanged(true)
  }, [])

  const updateTimeFrame = useCallback((timeframe: string) => {
    setTimeframe(timeframe)
    setHasChanged(true)
  }, [])

  const updateSymbol = useCallback((symbol: string) => {
    setSymbol(symbol)
    setHasChanged(true)
  }, [])

  return (
    <div style={modalStyles.container}>
      <div style={modalStyles.header}>
        <ChartModalHeader
          language={language}
          setLanguage={setLanguage}
          handleClose={handleClose}
        />
      </div>
      
      <div style={modalStyles.scrollableContent}>
        <div style={modalStyles.titleSection}>
          <TitleInputBlock
            title={title}
            setTitle={setTitle}
            isActive={isActive}
            setIsActive={setIsActive}
          />
        </div>

        <div style={modalStyles.mainContent}>
          <div style={modalStyles.leftPanel}>
            {checkDescription ? (
              <div style={modalStyles.previewContainer}>
                <div style={modalStyles.sectionHeader}>
                  <h3 style={modalStyles.sectionTitle}>Description Preview</h3>
                </div>
                <div style={modalStyles.previewContent}>
                  <DescriptionPreview text={description[language]} />
                </div>
              </div>
            ) : (
              <div style={modalStyles.chartSection}>
                <div style={modalStyles.sectionHeader}>
                  <h3 style={modalStyles.sectionTitle}>Chart Configuration</h3>
                  <div style={modalStyles.statusBadge}>
                    {hasChanged ? (
                      <span style={{ ...modalStyles.statusText, color: colors.red }}>
                        ● Chart needs update
                      </span>
                    ) : (
                      <span style={{ ...modalStyles.statusText, color: colors.green }}>
                        ● Chart ready
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={modalStyles.chartContainer}>
                  <CandlestickChart
                    candles={candles}
                    candlesFirstHalf={+candlesFirstHalf}
                    showFullChart={showFullChart}
                  />
                </div>
                <div style={modalStyles.sectionHeader}>
              <h3 style={modalStyles.sectionTitle}>Quiz Description</h3>
            </div>
            <div style={modalStyles.editorContainer}>
              <DescriptionInput
                value={description[language]}
                onChange={updateText}
              />
            </div>
               
              </div>
            )}
          </div>
          
          <div style={modalStyles.rightPanel}>
          <div style={modalStyles.controlsGrid}>
                  <div style={modalStyles.controlRow}>
                    <DatePickerBlock
                      startDate={startDate}
                      setStartDate={updateStartDate}
                      endDate={endDate}
                      setEndDate={updateEndDate}
                    />
                  </div>
                  <div style={modalStyles.controlRow}>
                    <ChartParamsBlock
                      timeframe={timeframe}
                      setTimeframe={updateTimeFrame}
                      symbol={symbol}
                      setSymbol={updateSymbol}
                      onRequest={bybitRequest}
                      hasChanged={hasChanged}
                    />
                  </div>
                  <div style={modalStyles.controlRow}>
                    <AnswerPickerBlock
                      answer={answer}
                      setAnswer={setAnswer}
                      candlesFirstHalf={candlesFirstHalf}
                      setCandlesFirstHalf={setCandlesFirstHalf}
                      candlesAmount={candles.length}
                      showFullChart={showFullChart}
                      toggleShowFullChart={() => setShowFullChart(!showFullChart)}
                      points={points}
                      setPoints={setPoints}
                    />
                  </div>
                </div>
            
          </div>
        </div>
      </div>

      <div style={modalStyles.footer}>
        <ChartModalFooter
          handleSave={handleSave}
          handleCheckDescription={() => {
            setCheckDescription(!checkDescription)
          }}
          disabled={hasChanged}
        />
      </div>
    </div>
  )
}

const modalStyles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    maxHeight: '100vh',
    backgroundColor: colors.bg,
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: `0 20px 60px ${colors.black}40`,
  },

  header: {
    flexShrink: 0,
    padding: '10px 12px 0',
    borderBottom: `1px solid ${colors.border}`,
  },

  scrollableContent: {
    flex: 1,
    overflow: 'auto',
    padding: '20px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    minHeight: 0,
  },

  titleSection: {
    flexShrink: 0,
  },

  mainContent: {
    display: 'flex',
    gap: '24px',
    flex: 1,
    minHeight: '600px', // Минимальная высота для контента
  },

  leftPanel: {
    flex: 2,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },

  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: `2px solid ${colors.border}`,
    flexShrink: 0,
  },

  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.white,
    margin: 0,
    letterSpacing: '-0.5px',
  },

  statusBadge: {
    padding: '6px 12px',
    borderRadius: '20px',
    backgroundColor: colors.greyhard,
    border: `1px solid ${colors.border}`,
  },

  statusText: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },

  chartSection: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: 0,
  },

  chartContainer: {
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: colors.greyhard,
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    flexShrink: 0,
    height: '400px', // Фиксированная высота чарта
  },

  controlsGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    flexShrink: 0,
  },

  controlRow: {
    display: 'flex',
    flexDirection: 'column',
  },

  previewContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.greyhard,
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    overflow: 'hidden',
  },

  previewContent: {
    flex: 1,
    overflow: 'auto',
    padding: '20px',
  },

  editorContainer: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: colors.greyhard,
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    // overflow: 'hidden',
  
  },

  footer: {
    flexShrink: 0,
    padding: '0 24px 16px',
    borderTop: `1px solid ${colors.border}`,
  },
}

export default CreateChartQuizModal