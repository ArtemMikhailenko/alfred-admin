import { CSSProperties, useRef } from 'react'
import colors from '../constants/colors'
import { styles } from './styles'

export default function ModalFooter({
  handleFileUpload,
  downloadJSON,
  handleSave,
}: {
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  downloadJSON: () => void
  handleSave: () => void
}) {
  const fileInput = useRef<HTMLInputElement>(null)

  return (
    <div style={styles.rowFooter}>
      <input
        type="file"
        accept=".json"
        ref={fileInput}
        onChange={handleFileUpload}
        style={{ display: 'none' }}
      />
      <button
        style={{ ...styles.buttonFooter, backgroundColor: colors.grey }}
        onClick={() => fileInput.current?.click()}
      >
        Choose File
      </button>
      <button
        style={{ ...styles.buttonFooter, backgroundColor: colors.grey }}
        onClick={downloadJSON}
      >
        Export File
      </button>
      <div style={{ flex: 1 }} />
      <button style={styles.buttonFooter} onClick={handleSave}>
        Save
      </button>
    </div>
  )
}
