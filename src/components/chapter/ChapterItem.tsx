import React from 'react'
import { 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  Circle, 
  GraduationCap,
  Award,
  ChevronRight,
  Clock,
  Users
} from 'lucide-react'
import { Chapter, Language } from '../../constants/interfaces'
import styles from './ChapterItem.module.css'

interface ChapterItemProps {
  chapter: Chapter
  openChapter: (c: Chapter) => void
  language: Language
  index?: number
  isCompleted?: boolean
  progress?: number
}

function ChapterItem({
  chapter,
  openChapter,
  language,
  index = 0,
  isCompleted = false,
  progress = 0
}: ChapterItemProps) {
  const hasLessons = chapter.lessons && chapter.lessons.length > 0
  const hasFinalTest = chapter.finalTest && chapter.finalTest.length > 0
  const lessonsCount = chapter.lessons?.length || 0
  const estimatedTime = lessonsCount * 15 // 15 минут на урок

  const getStatusIcon = () => {
    if (isCompleted) {
      return <CheckCircle2 size={20} className={styles.statusCompleted} />
    } else if (progress > 0) {
      return (
        <div className={styles.progressRing}>
          <svg className={styles.progressSvg} viewBox="0 0 36 36">
            <path
              className={styles.progressCircleBg}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className={styles.progressCircle}
              strokeDasharray={`${progress}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span className={styles.progressText}>{Math.round(progress)}%</span>
        </div>
      )
    } else {
      return <Circle size={20} className={styles.statusPending} />
    }
  }

  return (
    <div 
      className={`${styles.chapterCard} ${isCompleted ? styles.completed : ''}`}
      onClick={() => openChapter(chapter)}
    >
      {/* Chapter Number Badge */}
      <div className={styles.chapterBadge}>
        <span className={styles.chapterNumber}>{index + 1}</span>
      </div>

      {/* Main Content */}
      <div className={styles.chapterContent}>
        <div className={styles.chapterHeader}>
          <div className={styles.chapterTitleRow}>
            <h3 className={styles.chapterTitle}>
              {chapter.name?.[language] || 'Untitled Chapter'}
            </h3>
            {getStatusIcon()}
          </div>
          
          {/* Chapter Meta Info */}
          <div className={styles.chapterMeta}>
            <div className={styles.metaItem}>
              <GraduationCap size={14} />
              <span>{lessonsCount} lesson{lessonsCount !== 1 ? 's' : ''}</span>
            </div>
            
            {estimatedTime > 0 && (
              <div className={styles.metaItem}>
                <Clock size={14} />
                <span>~{Math.round(estimatedTime / 60)}h {estimatedTime % 60}m</span>
              </div>
            )}
            
            {hasFinalTest && (
              <div className={styles.metaItem}>
                <Award size={14} />
                <span>Final Test</span>
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        {progress > 0 && !isCompleted && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className={styles.progressLabel}>{Math.round(progress)}% complete</span>
          </div>
        )}

        {/* Chapter Description/Status */}
        <div className={styles.chapterDescription}>
          {isCompleted ? (
            <span className={styles.statusText}>
              ✅ Chapter completed! Great job!
            </span>
          ) : progress > 0 ? (
            <span className={styles.statusText}>
              📚 Continue learning - you're making progress!
            </span>
          ) : hasLessons ? (
            <span className={styles.statusText}>
              🚀 Ready to start this chapter
            </span>
          ) : (
            <span className={styles.statusText}>
              ⚠️ No lessons available yet
            </span>
          )}
        </div>
      </div>

      {/* Action Arrow */}
      <div className={styles.chapterAction}>
        <ChevronRight size={20} className={styles.actionIcon} />
      </div>

      {/* Hover Effect Overlay */}
      <div className={styles.hoverOverlay} />
    </div>
  )
}

export default React.memo(ChapterItem)