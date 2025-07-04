import { useEffect, useState } from 'react'
import Modal from 'react-modal'
import '../styles/AdminPanel.css'
import LessonItem from '../components/lesson/LessonItem'
import {
  Chapter,
  Course,
  FinalTest,
  Language,
  languagesObjString,
  LessonWithLanguages,
  Quiz,
} from '../constants/interfaces'
import FinalTestCreator from '../components/finalTest/FinalTestCreator'
import globalStyles from '../constants/globalStyles'
import { useParams } from 'react-router-dom'
import LessonsHeader from '../components/lesson/LessonsHeader'
import {
  DeleteLesson,
  GetAllLessonsInChapter,
  GetCourseById,
} from '../actions/actions'
import CreateLessonModal from '../components/CreateLessonModal'
import FinalTestItem from '../components/finalTest/FinalTestItem'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

Modal.setAppElement('#root')

const ChapterScreen = () => {
  const tokens = useSelector((state: RootState) => state.tokens)

  const { courseId, chapterId } = useParams()

  const [course, setCourse] = useState<Course>()

  const [chapter, setChapter] = useState<Chapter>()
  const [language, setLanguage] = useState<Language>('ua')

  const [modal, setModal] = useState<'lesson' | 'finalTest' | null>(null)
  const [currentLesson, setCurrentLesson] =
    useState<LessonWithLanguages | null>(null)
  const [currentFinalTest, setCurrentFinalTest] = useState<FinalTest | null>(
    null
  )

  async function GetChapterFunc() {
    if (courseId === undefined || chapterId === undefined) return
    const responseCourse = await GetCourseById(courseId)
    const responseChapter = await GetAllLessonsInChapter(chapterId)
    setCourse(responseCourse)
    setChapter(responseChapter)
  }

  useEffect(() => {
    GetChapterFunc()
  }, [])

  const handleCreateLesson = () => {
    if (chapterId) {
      setCurrentLesson({
        moduleId: chapterId || '',
        name: languagesObjString,
        text: languagesObjString,
        number: (chapter?.lessons?.length ?? 0) + 1,
        comment: languagesObjString,
        banner: '',
        avatar: '',
        motivation: languagesObjString,
        quiz: [],
      })
      setModal('lesson')
    } else {
      alert('Chapter id error, try again')
    }
  }

  const handleEditLesson = (lesson: LessonWithLanguages) => {
    setCurrentLesson(lesson)
    setModal('lesson')
  }

  const handleDeleteLesson = async (lesson: LessonWithLanguages) => {
    const confirmDelete = window.confirm(
      '🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑🛑\nAre you sure you want to delete this lesson'
    )
    if (confirmDelete && lesson.id && tokens.accessToken) {
      await DeleteLesson(lesson.id, tokens.accessToken)
      GetChapterFunc()
    }
  }

  const handleCreateFinalTest = () => {
    setCurrentFinalTest(chapter?.finalTest || [])
    setModal('finalTest')
  }

  const handleModalClose = (isUpdated: boolean) => {
    if (isUpdated) {
      const confirmClose = window.confirm(
        'You may have unsaved changes. Are you sure you want to close without saving?'
      )
      if (confirmClose) {
        setModal(null)
      }
    } else {
      setModal(null)
      GetChapterFunc()
    }
  }

  return (
    <div className="admin-container">
      <LessonsHeader
        onCreateLesson={handleCreateLesson}
        parentCourse={course}
        parentChapter={chapter}
        onCreateFinalTest={handleCreateFinalTest}
        language={language}
        setLanguage={setLanguage}
      />

      <p style={globalStyles.title}>Lessons:</p>

      <div className="lesson-list">
        {chapter &&
          chapter.lessons?.length &&
          chapter.lessons.map((lesson: LessonWithLanguages) => (
            <LessonItem
              key={lesson.id}
              lesson={lesson}
              handleEditLesson={handleEditLesson}
              language={language}
              handleDeleteLesson={handleDeleteLesson}
            />
          ))}
      </div>

      <p style={globalStyles.title}>Final test:</p>

      <div className="lesson-list">
        {chapter &&
          chapter.finalTest?.length &&
          chapter.finalTest.map((quiz: Quiz, i: number) => (
            <FinalTestItem key={i} quiz={quiz} language={language} />
          ))}
      </div>

      <Modal
        isOpen={modal !== null}
        onRequestClose={() => {}}
        shouldCloseOnEsc={false}
        shouldCloseOnOverlayClick={false}
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {currentLesson && modal === 'lesson' ? (
          <CreateLessonModal
            initialLessonValue={currentLesson}
            onClose={handleModalClose}
          />
        ) : modal === 'finalTest' ? (
          <FinalTestCreator
            chapter={chapter}
            initialQuiz={currentFinalTest || []}
            onClose={handleModalClose}
          />
        ) : (
          <></>
        )}
      </Modal>
    </div>
  )
}

export default ChapterScreen
