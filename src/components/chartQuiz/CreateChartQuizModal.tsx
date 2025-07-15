import React, { useCallback, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Language, languagesObjString } from '../../constants/interfaces'
import { TokensState } from '../../redux/tokens'
import { PostSwipeTrade, UpdateSwipeTrade } from '../../actions/actions'
import { ReloginAndRetry } from '../ReloginAndRetry'

// Component imports
import ChartModalHeader from './ChartModalHeader'
import ChartModalFooter from './ChartModalFooter'
import CandlestickChart from './CandlestickChart'
import AnswerPickerBlock from './AnswerPickerBlock'
import DatePickerBlock from './DatePickerBlock'
import ChartParamsBlock, { intervalMap } from './ChartParamsBlock'
import TitleInputBlock from './TitleInputBlock'
import DescriptionPreview from './DescriptionPreview'
import DescriptionInput from './DescriptionInput'

// Function imports
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

// Styles
import styles from './CreateChartQuizModal.module.css'

interface CreateChartQuizModalProps {
  initialValue: SwipeTradeQuizInterface | null
  onClose: (isUpdated: boolean) => void
  tokens: TokensState
}

const CreateChartQuizModal: React.FC<CreateChartQuizModalProps> = ({
  initialValue,
  onClose,
  tokens,
}) => {
  const dispatch = useDispatch()
  
  // State management
  const [language, setLanguage] = useState<Language>('ua')
  const [isActive, setIsActive] = useState<boolean>(
    initialValue ? initialValue.isActive : true
  )
  const [title, setTitle] = useState<string>(initialValue?.title || '')
  const [description, setDescription] = useState<Record<Language, string>>(
    initialValue?.description || languagesObjString
  )

  // Chart parameters
  const [symbol, setSymbol] = useState(initialValue?.settings.pair || 'BTCUSDT')
  const [startDate, setStartDate] = useState<string>(
    initialValue?.settings.startDate
      ? ParseDateTimeString(initialValue.settings.startDate)
      : '2024-01-01T00:00'
  )
  const [endDate, setEndDate] = useState<string>(
    initialValue?.settings.endDate
      ? ParseDateTimeString(initialValue.settings.endDate)
      : '2024-01-01T01:00'
  )
  const [timeframe, setTimeframe] = useState<string>(
    initialValue?.settings.timeframe
      ? FormatIntervalValue(initialValue.settings.timeframe)
      : '1'
  )

  // Chart data
  const [candles, setCandles] = useState<WagmiCandle[]>(
    initialValue?.candleData || []
  )

  // Quiz settings
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
  
  // UI state
  const [hasChanged, setHasChanged] = useState<boolean>(
    initialValue?.id ? false : true
  )
  const [checkDescription, setCheckDescription] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Handlers
  const handleClose = () => {
    onClose(true)
  }

  const generateChart = async () => {
    if (isLoading) return
    
    setIsLoading(true)
    try {
      const start = new Date(startDate)
      const end = new Date(endDate)
      const intervalMs = intervalMap[timeframe]

      if (start.getTime() > end.getTime()) {
        alert('Invalid time input: Start date must be before end date')
        return
      }
      
      if (!intervalMs || end.getTime() - start.getTime() < intervalMs) {
        alert('Invalid timeframe: Time range is too small for selected interval')
        return
      }

      const limit = Math.floor((end.getTime() - start.getTime()) / intervalMs)

      if (limit > 1000) {
        alert(`Will only render the first 1000 candles out of ${limit}`)
      }
      
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
      console.error('Error fetching chart data:', err)
      alert(`Failed to fetch chart data: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!(tokens.accessToken && tokens.email)) return
    if (isLoading) return

    if (hasChanged) {
      alert('Please generate the chart first')
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
        `Not all properties are filled properly:${
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

    setIsLoading(true)
    try {
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
    } catch (error) {
      console.error('Error saving quiz:', error)
      alert('Failed to save quiz. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Memoized update functions
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

  const updateTimeFrame = useCallback((frame: string) => {
    setTimeframe(frame)
    setHasChanged(true)
  }, [])

  const updateSymbol = useCallback((sym: string) => {
    setSymbol(sym)
    setHasChanged(true)
  }, [])

  return (
    <div className={styles.container}>
      <ChartModalHeader
        language={language}
        setLanguage={setLanguage}
        handleClose={handleClose}
      />
      
      <div className={styles.content}>
        <TitleInputBlock
          title={title}
          setTitle={setTitle}
          isActive={isActive}
          setIsActive={setIsActive}
        />

        <div className={styles.mainContent}>
          <div className={styles.leftColumn}>
            {checkDescription ? (
              <DescriptionPreview text={description[language]} />
            ) : (
              <div className={styles.chartSection}>
                <CandlestickChart
                  candles={candles}
                  candlesFirstHalf={+candlesFirstHalf}
                  showFullChart={showFullChart}
                />
                
                <div className={styles.controlsSection}>
                  <DatePickerBlock
                    startDate={startDate}
                    setStartDate={updateStartDate}
                    endDate={endDate}
                    setEndDate={updateEndDate}
                  />
                  
                  <ChartParamsBlock
                    timeframe={timeframe}
                    setTimeframe={updateTimeFrame}
                    symbol={symbol}
                    setSymbol={updateSymbol}
                    onRequest={generateChart}
                    hasChanged={hasChanged}
                  />
                  
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
            )}
          </div>
          
          <div className={styles.rightColumn}>
            <DescriptionInput
              value={description[language]}
              onChange={updateText}
            />
          </div>
        </div>
      </div>

      <ChartModalFooter
        handleSave={handleSave}
        handleCheckDescription={() => setCheckDescription(!checkDescription)}
        disabled={hasChanged || isLoading}
      />
      
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingSpinner}>
            <div className={styles.spinner} />
            <p className={styles.loadingText}>
              {hasChanged ? 'Generating chart...' : 'Saving quiz...'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default CreateChartQuizModal