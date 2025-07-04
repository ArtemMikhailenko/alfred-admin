import { CSSProperties, useState } from 'react'
import globalStyles from '../../constants/globalStyles'
import { PostCourse } from '../../actions/actions'
import LanguageSelectorBlock from '../LanguageSelectorBlock'
import {
  Language,
  languagesList,
  languagesObjString,
} from '../../constants/interfaces'
import colors from '../../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux'
import { clearTokens } from '../../redux/tokens'
import { useNavigate } from 'react-router-dom'
import { styles } from './styles'
import { ReloginAndRetry } from '../ReloginAndRetry'

const CreateCourseModal = ({
  onClose,
}: {
  onClose: (isUpdated: boolean) => void
}) => {
  const tokens = useSelector((state: RootState) => state.tokens)
  const [name, setName] = useState<Record<Language, string>>(languagesObjString)
  const [description, setDescription] =
    useState<Record<Language, string>>(languagesObjString)
  const [localLanguage, setLocalLanguage] = useState<Language>('ua')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const isValid = () => {
    for (const lang of languagesList) {
      const localName = name[lang]
      const localDescription = description[lang]

      // Check name nad description is not empty
      if (
        !localName ||
        localName.trim() === '' ||
        !localDescription ||
        localDescription.trim() === ''
      ) {
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
      const response = await PostCourse(name, description, accessToken)
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
    onClose(false)
  }

  return (
    <div style={styles.createModal}>
      <p style={globalStyles.title}>Create Course</p>
      <LanguageSelectorBlock
        language={localLanguage}
        setLanguage={setLocalLanguage}
      />
      <input
        type="text"
        placeholder="Enter course title..."
        value={name[localLanguage]}
        onChange={(e) => setName({ ...name, [localLanguage]: e.target.value })}
        style={globalStyles.oneLineInput}
      />
      <input
        type="text"
        placeholder="Enter course description..."
        value={description[localLanguage]}
        onChange={(e) =>
          setDescription({ ...description, [localLanguage]: e.target.value })
        }
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

export default CreateCourseModal
