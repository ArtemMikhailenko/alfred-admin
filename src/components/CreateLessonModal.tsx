import React, {
  ChangeEvent,
  useCallback,
  useRef,
  useState,
  useMemo,
} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Editor } from '@tinymce/tinymce-react'
import {
  X,
  BookOpen,
  Edit3,
  HelpCircle,
  Upload,
  Download,
  Save,
  AlertCircle,
  Check,
  Loader2,
  FileText,
  MessageSquare,
  Target,
  Hash,
  Image,
  User,
  Globe,
  Eye,
  EyeOff
} from 'lucide-react'
import {
  Language,
  languagesObjArray,
  languagesObjString,
  LessonWithLanguages,
  Page,
  Quiz,
  languagesList,
} from '../constants/interfaces'
import { PostLesson, UpdateLesson } from '../actions/actions'
import { RootState } from '../redux'
import { clearTokens } from '../redux/tokens'
// Импортируем компонент для создания квизов
import QuizCreationBlock from './quiz/QuizCreationBlock'
import styles from './CreateLessonModal.module.css'

interface CreateLessonModalProps {
  initialLessonValue: LessonWithLanguages
  onClose: (isUpdated: boolean) => void
}

const CreateLessonModal: React.FC<CreateLessonModalProps> = ({
  initialLessonValue,
  onClose,
}) => {
  const tokens = useSelector((state: RootState) => state.tokens)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // UI State
  const [page, setPage] = useState<Page>('theory')
  const [language, setLanguage] = useState<Language>('ua')
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Image State
  const [showImageBannerInputs, setShowImageBannerInputs] = useState<boolean>(false)
  const [showImageAvatarInputs, setShowImageAvatarInputs] = useState<boolean>(false)
  const [banner, setBanner] = useState<string | File | null>(initialLessonValue.banner)
  const [avatar, setAvatar] = useState<string | File | null>(initialLessonValue.avatar)

  // Content State - ИСПРАВЛЕНО: инициализируем quiz правильно
  const [name, setName] = useState<LessonWithLanguages['name']>(initialLessonValue.name)
  const [motivation, setMotivation] = useState<LessonWithLanguages['motivation']>(initialLessonValue.motivation)
  const [comment, setComment] = useState<LessonWithLanguages['comment']>(initialLessonValue.comment)
  const [number, setNumber] = useState(initialLessonValue.number)
  const [text, setText] = useState<LessonWithLanguages['text']>(initialLessonValue.text)
  // ИСПРАВЛЕНО: правильная инициализация квиза
  const [quiz, setQuiz] = useState<Quiz[]>(
    Array.isArray(initialLessonValue.quiz) && initialLessonValue.quiz.length > 0 
      ? initialLessonValue.quiz.filter(q => q !== null) as Quiz[]
      : []
  )

  const editorRef = useRef<any>(null)
  const bannerFileInput = useRef<HTMLInputElement>(null)
  const avatarFileInput = useRef<HTMLInputElement>(null)
  const jsonFileInput = useRef<HTMLInputElement>(null)
  const [activeBlockId, setActiveBlockId] = useState<string | null>(null)

  // Validation
  const validateForm = useCallback(() => {
    const errors: Record<string, string> = {}
    
    for (const lang of languagesList) {
      if (!name[lang]?.trim()) {
        errors[`name_${lang}`] = `Title is required in ${lang.toUpperCase()}`
      }
      if (!text[lang]?.trim()) {
        errors[`text_${lang}`] = `Content is required in ${lang.toUpperCase()}`
      }
    }

    if (!banner) {
      errors.banner = 'Banner image is required'
    }
    
    if (!avatar) {
      errors.avatar = 'Avatar image is required'
    }

    if (number < 1) {
      errors.number = 'Lesson number must be greater than 0'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [name, text, banner, avatar, number])

  const isFormValid = useMemo(() => {
    return banner && avatar && number > 0 && 
           languagesList.every(lang => name[lang]?.trim() && text[lang]?.trim())
  }, [name, text, banner, avatar, number])

  const overallProgress = useMemo(() => {
    const totalFields = languagesList.length * 2 + 3
    let completedFields = 0
    
    languagesList.forEach(lang => {
      if (name[lang]?.trim()) completedFields++
      if (text[lang]?.trim()) completedFields++
    })
    
    if (banner) completedFields++
    if (avatar) completedFields++
    if (number > 0) completedFields++
    
    return Math.round((completedFields / totalFields) * 100)
  }, [name, text, banner, avatar, number])

  // Event Handlers
  const logOut = useCallback(() => {
    localStorage.clear()
    dispatch(clearTokens())
    navigate('/login')
  }, [dispatch, navigate])

  const handleSave = async () => {
    if (!tokens.accessToken) {
      logOut()
      return
    }

    if (!validateForm()) {
      alert('Please fill in all required fields')
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('moduleId', String(initialLessonValue.moduleId))
      formData.append('number', String(number))
      formData.append('comment', JSON.stringify(comment))
      formData.append('name', JSON.stringify(name))
      formData.append('text', JSON.stringify(text))
      formData.append('motivation', JSON.stringify(motivation))
      // ИСПРАВЛЕНО: правильно сериализуем квиз
      formData.append('quiz', JSON.stringify(quiz))
      formData.append('banner', banner as File)
      formData.append('avatar', avatar as File)

      let response
      if (initialLessonValue.id) {
        response = await UpdateLesson(initialLessonValue.id, formData, tokens.accessToken)
      } else {
        response = await PostLesson(formData, tokens.accessToken)
      }

      if (response.error && response.statusCode === 401) {
        alert(response.error)
        logOut()
        return
      }

      onClose(false)
    } catch (error) {
      alert('Failed to save lesson')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    const hasChanges = Object.values(name).some(n => n.trim()) || 
                      Object.values(text).some(t => t.trim()) ||
                      banner || avatar || quiz.length > 0
    
    if (hasChanges) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close?'
      )
      if (!confirmClose) return
    }
    
    onClose(true)
  }

  const downloadJSON = () => {
    const fileData = JSON.stringify({
      name,
      comment,
      motivation,
      text,
      quiz,
    }, null, 2)
    
    const blob = new Blob([fileData], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'lesson.json'
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const result = event.target?.result as string
          const json = JSON.parse(result)
          setName(json.name || languagesObjString)
          setText(json.text || json.content || languagesObjString)
          setComment(json.comment || languagesObjString)
          setMotivation(json.motivation || languagesObjString)
          // ИСПРАВЛЕНО: правильно обрабатываем квиз из JSON
          setQuiz(Array.isArray(json.quiz) ? json.quiz.filter((q: null) => q !== null) : [])
        } catch (error) {
          alert('Invalid JSON file format')
        }
      }
      reader.readAsText(file)
    }
  }

  const handleBannerChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && ['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      setBanner(file)
      setShowImageBannerInputs(false)
    } else {
      alert('Only .jpeg, .jpg, .png files are allowed for banner')
    }
  }

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && ['image/svg+xml'].includes(file.type)) {
      setAvatar(file)
      setShowImageAvatarInputs(false)
    } else {
      alert('Only .svg files are allowed for avatar')
    }
  }

  // Update functions
  const updateName = useCallback((newText: string) => {
    setName(prev => ({ ...prev, [language]: newText }))
  }, [language])

  const updateMotivation = useCallback((newText: string) => {
    setMotivation(prev => ({ ...prev, [language]: newText }))
  }, [language])

  const updateComment = useCallback((newText: string) => {
    setComment(prev => ({ ...prev, [language]: newText }))
  }, [language])

  const updateText = useCallback((newText: string) => {
    setText(prev => ({ ...prev, [language]: newText }))
  }, [language])

  // ДОБАВЛЕНО: функция для обновления квиза
  const updateQuiz = useCallback((newQuiz: Quiz[]) => {
    setQuiz(newQuiz)
  }, [])

  const getLanguageCompletionStatus = useCallback((lang: Language) => {
    const hasName = name[lang]?.trim().length > 0
    const hasText = text[lang]?.trim().length > 0
    
    if (hasName && hasText) return 'complete'
    if (hasName || hasText) return 'partial'
    return 'empty'
  }, [name, text])

  // TinyMCE setup
  const addNewBlock = (editor: any) => {
    const blockId = `custom-block-${Date.now()}`
    editor.insertContent(
      `<div id="${blockId}" class="custom-block" contenteditable="true" onclick="this.focus()">
        Enter your text here...
      </div>`
    )
    setActiveBlockId(blockId)
  }

  const updateBlockStyle = () => {
    const editor: any = editorRef.current
    const block = editor.getBody().querySelector(`#${activeBlockId}`)
    if (block) {
      block.style.backgroundColor = '#333439'
      block.style.borderRadius = '10px'
    }
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              {initialLessonValue.id ? <Edit3 size={24} /> : <BookOpen size={24} />}
            </div>
            <div>
              <h2 className={styles.modalTitle}>
                {initialLessonValue.id ? 'Edit Lesson' : 'Create New Lesson'}
              </h2>
              <p className={styles.modalSubtitle}>
                Design engaging educational content
              </p>
            </div>
          </div>

          <div className={styles.headerRight}>
            {/* Progress */}
            <div className={styles.progressSection}>
              <span className={styles.progressLabel}>Progress: {overallProgress}%</span>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill}
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleClose}
              disabled={isLoading}
              className={styles.closeButton}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          <div className={styles.tabLeft}>
            <button
              onClick={() => setPage('theory')}
              className={`${styles.tabButton} ${page === 'theory' ? styles.active : ''}`}
            >
              <FileText size={16} />
              Theory
            </button>
            <button
              onClick={() => setPage('quiz')}
              className={`${styles.tabButton} ${page === 'quiz' ? styles.active : ''}`}
            >
              <HelpCircle size={16} />
              Quiz ({quiz.length})
            </button>
          </div>

          <div className={styles.tabRight}>
            {/* Language Selector */}
            <div className={styles.languageSection}>
              <Globe size={16} />
              <div className={styles.languageTabs}>
                {languagesList.map((lang) => {
                  const status = getLanguageCompletionStatus(lang)
                  return (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`${styles.languageTab} ${
                        language === lang ? styles.active : ''
                      } ${styles[status]}`}
                      disabled={isLoading}
                    >
                      <span>{lang.toUpperCase()}</span>
                      <div className={styles.statusIcon}>
                        {status === 'complete' && <Check size={12} />}
                        {status === 'partial' && <AlertCircle size={12} />}
                        {status === 'empty' && <div className={styles.emptyDot} />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {page === 'theory' ? (
            <>
              {/* Image Upload Section */}
              <div className={styles.imageSection}>
                {/* Banner */}
                <div className={styles.imageRow}>
                  <button
                    onClick={() => setShowImageBannerInputs(!showImageBannerInputs)}
                    className={styles.imageButton}
                  >
                    <Image size={16} />
                    {banner ? 'Edit Banner' : 'Add Banner'}
                  </button>
                  
                  {showImageBannerInputs ? (
                    <div className={styles.imageInputs}>
                      <input
                        ref={bannerFileInput}
                        type="file"
                        accept=".jpeg,.jpg,.png"
                        onChange={handleBannerChange}
                        style={{ display: 'none' }}
                      />
                      <button
                        onClick={() => bannerFileInput.current?.click()}
                        className={styles.fileSelectButton}
                      >
                        Choose Banner File
                      </button>
                      <button
                        onClick={() => setShowImageBannerInputs(false)}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : banner ? (
                    <img
                      src={typeof banner === 'string' ? banner : URL.createObjectURL(banner)}
                      alt="Banner preview"
                      className={styles.imagePreview}
                    />
                  ) : (
                    <span className={styles.requiredText}>Required</span>
                  )}
                </div>

                {/* Avatar */}
                <div className={styles.imageRow}>
                  <button
                    onClick={() => setShowImageAvatarInputs(!showImageAvatarInputs)}
                    className={styles.imageButton}
                  >
                    <User size={16} />
                    {avatar ? 'Edit Avatar' : 'Add Avatar'}
                  </button>
                  
                  {showImageAvatarInputs ? (
                    <div className={styles.imageInputs}>
                      <input
                        ref={avatarFileInput}
                        type="file"
                        accept=".svg"
                        onChange={handleAvatarChange}
                        style={{ display: 'none' }}
                      />
                      <button
                        onClick={() => avatarFileInput.current?.click()}
                        className={styles.fileSelectButton}
                      >
                        Choose Avatar File
                      </button>
                      <button
                        onClick={() => setShowImageAvatarInputs(false)}
                        className={styles.cancelButton}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : avatar ? (
                    <img
                      src={typeof avatar === 'string' ? avatar : URL.createObjectURL(avatar)}
                      alt="Avatar preview"
                      className={styles.imagePreview}
                    />
                  ) : (
                    <span className={styles.requiredText}>Required</span>
                  )}
                </div>
              </div>

              {/* Title and Metadata */}
              <div className={styles.metadataSection}>
                <div className={styles.formGroup}>
                  <label className={styles.formLabel}>
                    <FileText size={16} />
                    Lesson Title <span className={styles.required}>*</span>
                  </label>
                  <input
                    type="text"
                    value={name[language] || ''}
                    onChange={(e) => updateName(e.target.value)}
                    placeholder={`Enter lesson title in ${language.toUpperCase()}...`}
                    className={styles.formInput}
                    disabled={isLoading}
                  />
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <MessageSquare size={16} />
                      Comment
                    </label>
                    <textarea
                      value={comment[language] || ''}
                      onChange={(e) => updateComment(e.target.value)}
                      placeholder="Enter comment..."
                      className={styles.formTextarea}
                      disabled={isLoading}
                      rows={3}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <Target size={16} />
                      Motivation
                    </label>
                    <textarea
                      value={motivation[language] || ''}
                      onChange={(e) => updateMotivation(e.target.value)}
                      placeholder="Enter motivation..."
                      className={styles.formTextarea}
                      disabled={isLoading}
                      rows={3}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.formLabel}>
                      <Hash size={16} />
                      Number <span className={styles.required}>*</span>
                    </label>
                    <input
                      type="number"
                      value={number}
                      onChange={(e) => setNumber(Number(e.target.value))}
                      placeholder="Lesson number"
                      className={styles.formInput}
                      disabled={isLoading}
                      min={1}
                    />
                  </div>
                </div>
              </div>

              {/* TinyMCE Editor */}
              <div className={styles.editorSection}>
                <label className={styles.formLabel}>
                  <Edit3 size={16} />
                  Lesson Content <span className={styles.required}>*</span>
                </label>
                <div className={styles.editorContainer}>
                  <Editor
                    apiKey={process.env.REACT_APP_TINY_API_KEY}
                    onInit={(_evt: any, editor: any) => {
                      editorRef.current = editor

                      // Add custom buttons
                      editor.ui.registry.addButton('insertBlock', {
                        text: 'Add Block',
                        onAction: () => addNewBlock(editor),
                      })

                      editor.ui.registry.addSplitButton('highlightList', {
                        text: 'List Color',
                        icon: 'forecolor',
                        onAction: () => {
                          const color = prompt('Choose color (e.g., #FF0000 or red):')
                          if (color) {
                            editor.formatter.apply('highlightList', { value: color })
                          }
                        },
                        fetch: (callback: any) => {
                          const colors = [
                            { type: 'choiceitem', text: 'Red', value: '#FF0000' },
                            { type: 'choiceitem', text: 'Blue', value: '#0000FF' },
                            { type: 'choiceitem', text: 'Green', value: '#00FF00' },
                            { type: 'choiceitem', text: 'Orange', value: '#FFA500' },
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

                      editor.ui.registry.addButton('blockSettings', {
                        text: 'Edit Block',
                        onAction: () => {
                          if (activeBlockId) {
                            updateBlockStyle()
                          }
                        },
                      })

                      editor.ui.registry.addButton('touchtext', {
                        text: 'Touch Text',
                        onAction: () => {
                          const selectedText = editor.selection.getContent({ format: 'text' })
                          if (!selectedText) {
                            alert('Please select a word or phrase to add a description.')
                            return
                          }

                          const description = prompt('Enter description for this word:')
                          if (!description) return

                          const textTag = `<span class="touch-text" data-description="${description}">${selectedText}</span>`
                          editor.insertContent(textTag)
                        },
                      })
                    }}
                    initialValue={initialLessonValue.text[language]}
                    value={text[language]}
                    onEditorChange={(_, editor) => {
                      updateText(editor.getContent({ format: 'html' }));
                    }}
                    disabled={isLoading}
                    init={{
                      height: 800,
                      skin: 'oxide-dark',
                      content_css: 'dark',
                      directionality: 'ltr',
                      menubar: true,
                      placeholder: 'Enter lesson content...',
                      resize: true,
                      plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
                        'preview', 'anchor', 'searchreplace', 'visualblocks', 'code',
                        'fullscreen', 'insertdatetime', 'media', 'table', 'help', 'wordcount',
                        'textcolor', 'colorpicker'
                      ],
                      toolbar: 
                        'undo redo | blocks | bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | highlightList | backcolor | image | insertBlock | blockSettings | help | link | touchtext',
                      content_style: `
                        body { font-family: Helvetica, Arial, sans-serif; font-size: 14px; }
                        .custom-block { background-color: #333439; border-radius: 10px; padding: 10px; }
                        .touch-text { 
                          color: #F0B90B; 
                          text-decoration: none; 
                          cursor: pointer; 
                          position: relative; 
                          font-weight: bold; 
                        }
                        .touch-text:hover::after {
                          content: attr(data-description);
                          position: absolute;
                          background: #444;
                          color: #fff;
                          padding: 5px;
                          border-radius: 5px;
                          bottom: 15px;
                          left: 0;
                          white-space: nowrap;
                          font-size: 12px;
                        }
                      `,
                    }}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className={styles.quizSection}>
              {/* ИСПРАВЛЕНО: Добавлен интерфейс для создания квизов */}
              <QuizCreationBlock
                quiz={quiz}
                setQuiz={updateQuiz}
                language={language}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.modalFooter}>
          <div className={styles.footerLeft}>
            <input
              ref={jsonFileInput}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <button
              onClick={() => jsonFileInput.current?.click()}
              className={styles.secondaryButton}
              disabled={isLoading}
            >
              <Upload size={16} />
              Import JSON
            </button>
            <button
              onClick={downloadJSON}
              className={styles.secondaryButton}
              disabled={isLoading}
            >
              <Download size={16} />
              Export JSON
            </button>
          </div>

          <div className={styles.footerRight}>
            <button
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!isFormValid || isLoading}
              className={`${styles.saveButton} ${isFormValid && !isLoading ? styles.enabled : styles.disabled}`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className={styles.spinner} />
                  Saving...
                </>
              ) : (
                <>
                  <Save size={16} />
                  Save Lesson
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreateLessonModal