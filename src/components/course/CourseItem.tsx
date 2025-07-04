import React from 'react'
import { Course, Language } from '../../constants/interfaces'
import globalStyles from '../../constants/globalStyles'

function CourseItem({
  course,
  openCourse,
  language,
}: {
  course: Course
  openCourse: (c: Course) => void
  language: Language
}) {
  return (
    <div key={course.id} style={globalStyles.item}>
      <div
        style={{
          ...globalStyles.rowStart,
          height: '100%',
          cursor: 'pointer',
          flex: 1,
        }}
        onClick={() => openCourse(course)}
      >
        <p style={globalStyles.title}>{course.id}.</p>
        <p style={globalStyles.titleFlex}>{course.name?.[language] || ''}</p>
      </div>
    </div>
  )
}

export default React.memo(CourseItem)
