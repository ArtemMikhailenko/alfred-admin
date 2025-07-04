import {
  ChangeEvent,
  CSSProperties,
  useCallback,
  useRef,
  useState,
} from 'react'
import { Editor } from '@tinymce/tinymce-react'
import '../styles/Modal.css'
import TitleMotivationInputBlock from './TitleMotivationInputBlock'
import ImagePickerBlock from './imagePicker/ImagePickerBlock'
import {
  Language,
  languagesObjArray,
  languagesObjString,
  LessonWithLanguages,
  Page,
  Quiz,
} from '../constants/interfaces'
import ModalFooter from './ModalFooter'
import ModalHeader from './ModalHeader'
import QuizCreationBlock from './quiz/QuizCreationBlock'
import { PostLesson, UpdateLesson } from '../actions/actions'
import colors from '../constants/colors'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux'
import { useNavigate } from 'react-router-dom'
import { clearTokens } from '../redux/tokens'

const CreateLessonModal = ({
  initialLessonValue,
  onClose,
}: {
  initialLessonValue: LessonWithLanguages
  onClose: (isUpdated: boolean) => void
}) => {
  const tokens = useSelector((state: RootState) => state.tokens)

  const [page, setPage] = useState<Page>('theory')
  const [showImageBannerInputs, setShowImageBannerInputs] =
    useState<boolean>(false)
  const [showImageAvatarInputs, setShowImageAvatarInputs] =
    useState<boolean>(false)

  const [banner, setBanner] = useState<string | File | null>(
    initialLessonValue.banner
  )
  const [avatar, setAvatar] = useState<string | File | null>(
    initialLessonValue.avatar
  )
  const [name, setName] = useState<LessonWithLanguages['name']>(
    initialLessonValue.name
  )
  const [motivation, setMotivation] = useState<
    LessonWithLanguages['motivation']
  >(initialLessonValue.motivation)
  const [comment, setComment] = useState<LessonWithLanguages['comment']>(
    initialLessonValue.comment
  )
  const [number, setNumber] = useState(initialLessonValue.number)
  const [text, setText] = useState<LessonWithLanguages['text']>(
    initialLessonValue.text
  )
  const [quiz, setQuiz] = useState<LessonWithLanguages['quiz']>(
    initialLessonValue.quiz
  )
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [language, setLanguage] = useState<Language>('ua')

  const editorRef = useRef<Editor | null>(null)

  const [activeBlockId, setActiveBlockId] = useState<string | null>(null) // Відстежуємо активний блок

  function LogOut() {
    localStorage.clear()
    dispatch(clearTokens())
    navigate('/login')
  }

  const handleSave = async () => {
    if (!tokens.accessToken) {
      LogOut()
      return
    }
    if (!banner || !avatar) {
      alert('Banner and Avatar are required')
      return
    }
    const formData: FormData = new FormData()
    formData.append('moduleId', String(initialLessonValue.moduleId))
    formData.append('number', String(number))
    formData.append('comment', JSON.stringify(comment))
    formData.append('name', JSON.stringify(name))
    formData.append('text', JSON.stringify(text))
    formData.append('motivation', JSON.stringify(motivation))
    formData.append('quiz', JSON.stringify(quiz))
    formData.append('banner', banner)
    formData.append('avatar', avatar)

    let response
    if (initialLessonValue.id) {
      response = await UpdateLesson(
        initialLessonValue.id,
        formData,
        tokens.accessToken
      )
    } else {
      response = await PostLesson(formData, tokens.accessToken)
    }
    if (response.error && response.statusCode === 401) {
      alert(response.error)
      LogOut()
      return
    }

    onClose(false)
  }

  const downloadJSON = () => {
    const fileData = JSON.stringify(
      {
        name,
        comment,
        motivation,
        text,
        quiz,
      },
      null,
      2
    )
    const blob = new Blob([fileData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'lesson.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event: ProgressEvent<FileReader>) => {
        try {
          const result = event.target?.result as string
          const json = JSON.parse(result)
          setName(json.name || languagesObjString)
          setText(json.text || json.content || languagesObjString)
          setComment(json.comment || languagesObjString)
          setMotivation(json.motivation || languagesObjString)
          setQuiz(json.quiz || languagesObjArray)
        } catch (error) {
          alert('Invalid file format')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleClose = () => {
    onClose(true)
  }

  const addNewBlock = (editor: any) => {
    const blockId = `custom-block-${Date.now()}`
    editor.insertContent(
      `<div id="${blockId}" class="custom-block" contenteditable="true" onclick="this.focus()">
                Введіть текст тут...
            </div>`
    )
    setActiveBlockId(blockId)
  }

  const updateBlockStyle = () => {
    const editor: any = editorRef.current
    const block = editor.getBody().querySelector(`#${activeBlockId}`)
    if (block) {
      block.style.backgroundColor = '#F000000'
      block.style.borderRadius = `10px`
    }
  }

  //

  const updateName = useCallback(
    (newText: string) => {
      setName((prev) => ({
        ...prev,
        [language]: newText,
      }))
    },
    [language]
  )

  const updateMotivation = useCallback(
    (newText: string) => {
      setMotivation((prev) => ({
        ...prev,
        [language]: newText,
      }))
    },
    [language]
  )

  const updateComment = useCallback(
    (newText: string) => {
      setComment((prev) => ({
        ...prev,
        [language]: newText,
      }))
    },
    [language]
  )

  const updateText = useCallback(
    (newText: string) => {
      setText((prev) => ({
        ...prev,
        [language]: newText,
      }))
    },
    [language]
  )

  const updateQuiz = useCallback(
    (newQuiz: Quiz[]) => {
      setQuiz(newQuiz)
    },
    [language]
  )

  return (
    <div style={styles.container}>
      <ModalHeader
        page={page}
        setPage={setPage}
        language={language}
        setLanguage={setLanguage}
        handleClose={handleClose}
        isEdit={!!initialLessonValue.id}
      />
      <div style={{ height: '80%' }}>
        {page === 'theory' ? (
          <>
            <ImagePickerBlock
              banner={banner}
              setBanner={setBanner}
              avatar={avatar}
              setAvatar={setAvatar}
              showImageBannerInputs={showImageBannerInputs}
              setShowImageBannerInputs={setShowImageBannerInputs}
              showImageAvatarInputs={showImageAvatarInputs}
              setShowImageAvatarInputs={setShowImageAvatarInputs}
            />
            <TitleMotivationInputBlock
              title={name[language]}
              setTitle={updateName}
              motivation={motivation[language]}
              setMotivation={updateMotivation}
              comment={comment[language]}
              setComment={updateComment}
              number={number}
              setNumber={setNumber}
            />

            <Editor
              apiKey={process.env.REACT_APP_TINY_API_KEY}
              onInit={(_evt: any, editor: any) => {
                editorRef.current = editor

                // Додамо кнопку для вставки блоку в редактор
                editor.ui.registry.addButton('insertBlock', {
                  text: 'Додати блок',
                  onAction: () => addNewBlock(editor),
                })

                // Додати підтримку для кольору списку
                editor.ui.registry.addSplitButton('highlightList', {
                  text: 'Колір списку',
                  icon: 'forecolor',
                  onAction: () => {
                    const color = prompt(
                      'Оберіть колір (наприклад, #FF0000 або red):'
                    )
                    if (color) {
                      editor.formatter.apply('highlightList', {
                        value: color,
                      })
                    }
                  },
                  fetch: (callback: any) => {
                    const colors = [
                      {
                        type: 'choiceitem',
                        text: 'Червоний',
                        value: '#FF0000',
                      },
                      { type: 'choiceitem', text: 'Синій', value: '#0000FF' },
                      {
                        type: 'choiceitem',
                        text: 'Зелений',
                        value: '#00FF00',
                      },
                      {
                        type: 'choiceitem',
                        text: 'Помаранчевий',
                        value: '#FFA500',
                      },
                    ]
                    callback(colors)
                  },
                  onItemAction: (_: any, value: string) => {
                    editor.formatter.apply('highlightList', { value })
                  },
                })

                editor.formatter.register('highlightList', {
                  inline: 'span',
                  selector: 'li',
                  styles: { color: '%value' },
                })
              }}
              initialValue={initialLessonValue.text[language]}
              value={text[language]}
              onEditorChange={updateText}
              init={{
                height: 'calc(100vh - 600px)',
                display: 'flex',
                width: '100%',
                flex: 1,
                skin: 'oxide-dark',
                content_css: 'dark',
                directionality: 'ltr',
                menubar: true, // false
                placeholder: 'text...',
                resize: true,
                plugins: [
                  'advlist',
                  'autolink',
                  'lists',
                  'link',
                  'image',
                  'charmap',
                  'preview',
                  'anchor',
                  'searchreplace',
                  'visualblocks',
                  'code',
                  'fullscreen',
                  'insertdatetime',
                  'media',
                  'table',
                  'code',
                  'help',
                  'wordcount',
                ],
                toolbar:
                  'undo redo | blocks | ' +
                  'bold italic forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat | highlightList | backgroundColor | image | insertBlock | blockSettings | help | link|touchtext',
                content_style: `
                  body { font-family:Helvetica,Arial,sans-serif; font-size:14px; }
                  .custom-block { background-color: ${colors.grey}; border-radius: 10px; padding: 10px; }
                  .touch-text { color: #F0B90B; text-decoration: none; cursor: pointer; position: relative; font-weight: bold; }
                  .touch-text:hover::after {
                    content: attr(data-description);
                    position: absolute;
                    background: #444;
                    color: #fff;
                    padding: 5px;
                    border-radius: 5px;
                    bottom:15px;
                    left: 0;
                    white-space: nowrap;
                    font-size: 12px;
                  }
                                `,
                setup: (editor: any) => {
                  // Додати підтримку редагування фону та заокруглення
                  editor.ui.registry.addButton('blockSettings', {
                    text: 'Редагувати блок',
                    onAction: () => {
                      if (activeBlockId) {
                        updateBlockStyle()
                      }
                    },
                  })
                  editor.ui.registry.addButton('touchtext', {
                    text: 'Touch Text',
                    onAction: () => {
                      const selectedText = editor.selection.getContent({
                        format: 'text',
                      })
                      if (!selectedText) {
                        alert(
                          'Please select a word or phrase to add a description.'
                        )
                        return
                      }

                      const description = prompt(
                        'Enter description for this word:'
                      )
                      if (!description) return

                      const textTag = `<span class="touch-text" data-description="${description}">${selectedText}</span>`
                      editor.insertContent(textTag)
                    },
                  })
                },
              }}
            />
          </>
        ) : (
          <>
            <QuizCreationBlock
              quiz={quiz}
              setQuiz={updateQuiz}
              language={language}
            />
          </>
        )}
      </div>
      <div style={{ flex: 1 }} />
      <ModalFooter
        handleFileUpload={handleFileUpload}
        downloadJSON={downloadJSON}
        handleSave={handleSave}
      />
    </div>
  )
}

const styles: { [key: string]: CSSProperties } = {
  container: {
    maxWidth: '100%',
    height: '100%',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
}

export default CreateLessonModal
