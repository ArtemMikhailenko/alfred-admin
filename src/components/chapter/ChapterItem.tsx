import React from 'react'
import { Chapter, Language } from '../../constants/interfaces'
import globalStyles from '../../constants/globalStyles'

function ChapterItem({
  chapter,
  openChapter,
  language,
}: {
  chapter: Chapter
  openChapter: (c: Chapter) => void
  language: Language
}) {
  return (
    <div key={chapter.id} style={globalStyles.item}>
      <div
        style={{
          ...globalStyles.rowStart,
          height: '100%',
          cursor: 'pointer',
          flex: 1,
        }}
        onClick={() => openChapter(chapter)}
      >
        <p style={globalStyles.title}>{chapter.id}.</p>
        <p style={globalStyles.titleFlex}>{chapter.name?.[language] || ''}</p>
      </div>
    </div>
  )
}

export default React.memo(ChapterItem)
