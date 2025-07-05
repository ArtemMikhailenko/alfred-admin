// screens/CourseDetailScreen.tsx
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import CourseDetailScreen from '../components/CourseDetailScreen/CourseDetailScreen'

const CourseDetailScreenPage: React.FC = () => {
  const { courseId } = useParams()
  const navigate = useNavigate()

  const handleNavigateBack = () => {
    navigate('/courses') // Возврат к списку курсов
  }

  const handleNavigateToChapter = (courseId: string, chapterId: string) => {
    navigate(`/chapter/${courseId}/${chapterId}`)
  }

  return (
    <CourseDetailScreen
      courseId={courseId}
      onNavigateBack={handleNavigateBack}
      onNavigateToChapter={handleNavigateToChapter}
    />
  )
}

export default CourseDetailScreenPage