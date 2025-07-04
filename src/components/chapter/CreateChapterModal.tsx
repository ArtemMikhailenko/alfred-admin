import { CSSProperties, useState } from 'react'
import {
  Chapter,
  Language,
  languagesList,
  languagesObjString,
} from '../../constants/interfaces'
import globalStyles from '../../constants/globalStyles'
import { PostChapter } from '../../actions/actions'
import LanguageSelectorBlock from '../LanguageSelectorBlock'
import colors from '../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { useNavigate } from 'react-router-dom'
import { clearTokens } from '../../redux/tokens'
import { styles } from './styles'
import { ReloginAndRetry } from '../ReloginAndRetry'

const CreateChapterModal = ({
  courseId,
  onClose,
}: {
  courseId: number
  onClose: (isUpdated: boolean) => void
}) => {
  const tokens = useSelector((state: RootState) => state.tokens)
  const [name, setName] = useState<Record<Language, string>>(languagesObjString)
  const [localLanguage, setLocalLanguage] = useState<Language>('ua')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const isValid = () => {
    for (const lang of languagesList) {
      const localName = name[lang]

      // Check name nad description is not empty
      if (!localName || localName.trim() === '') {
        return false
      }
    }

    return true
  }

  function LogOut() {
    localStorage.clear()
    dispatch(clearTokens())
    navigate('/login')
  }

  const handleSave = async () => {
    if (!tokens.accessToken || !tokens.email) {
      LogOut()
      return
    }
    if (!isValid()) return

    const tryPost = async (accessToken: string): Promise<boolean> => {
      const response = await PostChapter(name, courseId, accessToken)
      if (response.error && response.statusCode === 401) {
        return false
      }

      onClose(false)
      return true
    }

    const success = await tryPost(tokens.accessToken)
    if (!success) {
      await ReloginAndRetry(tokens.email, dispatch, tryPost)
    }
  }

  const handleClose = () => {
    onClose(true)
  }

  return (
    <div style={styles.createModal}>
      <p style={globalStyles.title}>Create Chapter</p>
      <LanguageSelectorBlock
        language={localLanguage}
        setLanguage={setLocalLanguage}
      />
      <input
        type="text"
        placeholder="Enter chapter name..."
        value={name[localLanguage]}
        onChange={(e) => setName({ ...name, [localLanguage]: e.target.value })}
        style={globalStyles.oneLineInput}
      />
      <div style={globalStyles.rowBetween}>
        <button style={globalStyles.cancelButton} onClick={handleClose}>
          Cancel
        </button>
        <button
          style={{
            ...globalStyles.submitButton,
            backgroundColor: isValid() ? colors.yellow : colors.greyhard,
          }}
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default CreateChapterModal
