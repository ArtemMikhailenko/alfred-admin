import { useCallback, useEffect, useRef, useState } from 'react'
import ChartModalHeader from './ChartModalHeader'
import { Language, languagesObjString } from '../../constants/interfaces'
import ChartModalFooter from './ChartModalFooter'
import CandlestickChart from './CandlestickChart'
import { styles } from './styles'
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
  AdminLogin,
  LogIn,
  PostSwipeTrade,
  UpdateSwipeTrade,
} from '../../actions/actions'
import { setTokens, TokensState } from '../../redux/tokens'
import { useDispatch } from 'react-redux'
import DescriptionPreview from './DescriptionPreview'
import DescriptionInput from './DescriptionInput'
import { promptPassword } from '../../screens/SwipeTradeScreen'
import { ReloginAndRetry } from '../ReloginAndRetry'

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
        alert('invalid time input')
        return
      }
      if (!intervalMs || end.getTime() - start.getTime() < intervalMs) {
        alert('invalid timeframe')
        return
      }

      const limit = Math.floor((end.getTime() - start.getTime()) / intervalMs)

      if (limit > 1000) {
        alert(`will only render the first 1000 candles out of ${limit}`)
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
    }
  }

  async function handleSave() {
    if (!(tokens.accessToken && tokens.email)) return

    if (hasChanged) {
      alert('Draw the chart first')
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

  const updateTimeFrame = useCallback((date: string) => {
    setTimeframe(date)
    setHasChanged(true)
  }, [])

  const updateSymbol = useCallback((date: string) => {
    setSymbol(date)
    setHasChanged(true)
  }, [])

  return (
    <div style={styles.createModal}>
      <ChartModalHeader
        language={language}
        setLanguage={setLanguage}
        handleClose={handleClose}
      />
      <TitleInputBlock
        title={title}
        setTitle={setTitle}
        isActive={isActive}
        setIsActive={setIsActive}
      />

      <div style={styles.row}>
        <div style={styles.column}>
          {checkDescription ? (
            <DescriptionPreview text={description[language]} />
          ) : (
            <>
              <CandlestickChart
                candles={candles}
                candlesFirstHalf={+candlesFirstHalf}
                showFullChart={showFullChart}
              />
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
                onRequest={bybitRequest}
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
            </>
          )}
        </div>
        <div style={styles.column}>
          <DescriptionInput
            value={description[language]}
            onChange={updateText}
          />
        </div>
      </div>

      <ChartModalFooter
        handleSave={handleSave}
        handleCheckDescription={() => {
          setCheckDescription(!checkDescription)
        }}
        disabled={hasChanged}
      />
    </div>
  )
}

export default CreateChartQuizModal
