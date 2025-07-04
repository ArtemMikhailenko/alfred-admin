import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import '../styles/AdminPanel.css'
import { Language } from '../constants/interfaces'
import globalStyles from '../constants/globalStyles'
import { useNavigate } from 'react-router-dom'

import {
  AdminLogin,
  DeleteSwipeTrade,
  GetAllSwipeTrade,
} from '../actions/actions'
import { styles } from '../components/course/styles'
import SwipeTradeHeader from '../components/swipeTrade/SwipeTradeHeader'
import CreateChartQuizModal from '../components/chartQuiz/CreateChartQuizModal'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import { SwipeTradeQuizInterface } from '../components/chartQuiz/functions'
import SwipeTradeItem from '../components/swipeTrade/SwipeTradeItem'
import { setTokens, TokensState } from '../redux/tokens'
import { ReloginAndRetry } from '../components/ReloginAndRetry'

Modal.setAppElement('#root')

export function promptPassword(): Promise<string | null> {
  return new Promise((resolve) => {
    const password = window.prompt(
      'Your session expired. Please enter your password to continue:'
    )
    resolve(password)
  })
}

const SwipeTradeScreen = () => {
  const tokens: TokensState = useSelector((state: RootState) => state.tokens)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [quizes, setQuizes] = useState<SwipeTradeQuizInterface[]>([])

  const [modal, setModal] = useState<boolean>(false)
  const [language, setLanguage] = useState<Language>('ua')
  const [currentQuiz, setCurrentQuiz] =
    useState<SwipeTradeQuizInterface | null>(null)
  async function GetSwipeTradeInfoFunc() {
    if (!tokens.accessToken || !tokens.email) return

    const tryPost = async (accessToken: string): Promise<boolean> => {
      const response = await GetAllSwipeTrade(accessToken)
      if (response.error && response.statusCode === 401) {
        return false
      }

      if (response.quizzes) {
        setQuizes(response.quizzes)
      }
      return true
    }

    const success = await tryPost(tokens.accessToken)
    if (!success) {
      await ReloginAndRetry(tokens.email, dispatch, tryPost)
    }
  }

  useEffect(() => {
    GetSwipeTradeInfoFunc()
  }, [modal])

  const handleCreateQuiz = () => {
    setCurrentQuiz(null)
    setModal(true)
  }

  const handleEditQuiz = (quiz: SwipeTradeQuizInterface) => {
    setCurrentQuiz(quiz)
    setModal(true)
  }

  async function handleDeleteQuiz(quiz: SwipeTradeQuizInterface) {
    const confirmDelete = window.confirm(
      '🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑\nAre you sure you want to delete this quiz'
    )

    if (confirmDelete && quiz.id && tokens.accessToken && tokens.email) {
      const tryDelete = async (accessToken: string): Promise<boolean> => {
        const response = await DeleteSwipeTrade(quiz.id, accessToken)

        if (response.error) return false

        GetSwipeTradeInfoFunc()
        return true
      }

      const success = await tryDelete(tokens.accessToken)
      if (!success) {
        await ReloginAndRetry(tokens.email, dispatch, tryDelete)
      }
    }
  }

  const handleModalClose = (isUpdated: boolean) => {
    if (isUpdated) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      )
      if (confirmClose) {
        setModal(false)
      }
    } else {
      setModal(false)
    }
  }

  return (
    <div style={styles.container}>
      <SwipeTradeHeader
        onCreateQuiz={handleCreateQuiz}
        language={language}
        setLanguage={setLanguage}
      />
      <p style={globalStyles.title}>Swipe Trade Quizes:</p>

      <div className="lesson-list">
        {quizes?.length ? (
          quizes.map((item: SwipeTradeQuizInterface) => (
            <SwipeTradeItem
              key={item.id}
              quiz={item}
              handleEditQuiz={handleEditQuiz}
              handleDeleteQuiz={handleDeleteQuiz}
              language={language}
            />
          ))
        ) : (
          <p style={globalStyles.comment}>No quizes yet</p>
        )}
      </div>

      <Modal
        isOpen={modal}
        onRequestClose={() => {}}
        shouldCloseOnEsc={false}
        shouldCloseOnOverlayClick={false}
        style={styles.modal}
        overlayClassName="modal-overlay"
      >
        {modal ? (
          <>
            <CreateChartQuizModal
              initialValue={currentQuiz}
              onClose={handleModalClose}
              tokens={tokens}
            />
          </>
        ) : (
          <></>
        )}
      </Modal>
    </div>
  )
}

export default SwipeTradeScreen
