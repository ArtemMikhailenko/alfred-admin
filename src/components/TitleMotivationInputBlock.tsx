import { CSSProperties } from 'react'
import colors from '../constants/colors'
import { styles } from './styles'

export default function TitleMotivationInputBlock({
  title,
  setTitle,
  motivation,
  setMotivation,
  comment,
  setComment,
  number,
  setNumber,
}: {
  title: string
  setTitle: (s: string) => void
  motivation: string
  setMotivation: (s: string) => void
  comment: string
  setComment: (s: string) => void
  number: number
  setNumber: (s: number) => void
}) {
  return (
    <div style={styles.column}>
      <p style={styles.comment}>title</p>
      <input
        type="text"
        placeholder="Enter lesson title..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{ ...styles.input }}
      />
      <div style={styles.row}>
        <p style={styles.comment}>comment</p>
        <p style={styles.comment}>motivation</p>
        <p style={{ ...styles.comment, flex: 1 }}>number</p>
      </div>
      <div style={styles.row}>
        <textarea
          placeholder="comment text..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="motivation text..."
          value={motivation}
          onChange={(e) => setMotivation(e.target.value)}
          style={styles.input}
        />
        <textarea
          placeholder="number"
          value={number}
          onChange={(e) => setNumber(Number(e.target.value))}
          style={{ ...styles.input, flex: 1 }}
        />
      </div>
    </div>
  )
}
