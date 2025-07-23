import React, { useEffect } from 'react'
import colors from '../../constants/colors'
import { CSSProperties } from 'react'
import { Answer } from './functions'

interface TitleInputBlockProps {
  title: string
  setTitle: (title: string) => void
  isActive: boolean
  setIsActive: (active: boolean) => void
  // Новые пропы для автогенерации
  symbol?: string
  startDate?: string
  endDate?: string
  answer?: Answer
}

function TitleInputBlock({
  title,
  setTitle,
  isActive,
  setIsActive,
  symbol = '',
  startDate = '',
  endDate = '',
  answer = null,
}: TitleInputBlockProps) {
  
  // Автогенерация заголовка при изменении параметров
  useEffect(() => {
    if (symbol && startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      const formatDate = (date: Date) => {
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0')
        const year = date.getFullYear()
        const hours = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        
        return `${day}.${month}.${year},${hours}:${minutes}`
      }
      
      const direction = answer ? `,${answer}` : ''
      const pairFormatted = symbol.replace('USDT', '/USDT')
      const autoTitle = `${formatDate(start)}-${formatDate(end)},${pairFormatted}${direction}`
      
      // Автоматически обновляем заголовок
      setTitle(autoTitle)
    }
  }, [symbol, startDate, endDate, answer, setTitle])

  return (
    <div style={titleStyles.container}>
      <div style={titleStyles.header}>
        <div style={titleStyles.titleSection}>
          <label style={titleStyles.label}>Quiz Title</label>
          <div style={titleStyles.statusToggle}>
            <button
              style={{
                ...titleStyles.toggleButton,
                backgroundColor: isActive ? colors.green : colors.red,
                boxShadow: isActive 
                  ? `0 0 0 3px ${colors.green}20` 
                  : `0 0 0 3px ${colors.red}20`,
              }}
              onClick={() => setIsActive(!isActive)}
            >
              <span style={titleStyles.toggleIcon}>
                {isActive ? '✓' : '✗'}
              </span>
              {isActive ? 'Active' : 'Inactive'}
            </button>
          </div>
        </div>
      </div>
      
      <textarea
        style={titleStyles.textarea}
        placeholder="Enter quiz title or let it auto-generate..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = colors.yellow
          e.currentTarget.style.boxShadow = `0 0 0 3px ${colors.yellow}20`
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = colors.border
          e.currentTarget.style.boxShadow = 'none'
        }}
        rows={1}
      />
    </div>
  )
}

const titleStyles: { [key: string]: CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '10px',
    backgroundColor: colors.greyhard,
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },

  label: {
    fontSize: '16px',
    fontWeight: '600',
    color: colors.white,
    margin: 0,
  },

  statusToggle: {
    display: 'flex',
    alignItems: 'center',
  },

  toggleButton: {
    height: '36px',
    padding: '0 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    transition: 'all 0.2s ease',
    color: colors.white,
  },

  toggleIcon: {
    fontSize: '12px',
    fontWeight: '900',
  },

  textarea: {
    // minHeight: '30px',
    padding: '12px 10px',
    borderRadius: '8px',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.bg,
    color: colors.white,
    fontSize: '16px',
    fontWeight: '500',
    outline: 'none',
    resize: 'vertical',
    transition: 'all 0.3s ease',
    fontFamily: 'inherit',
  },

  hint: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '-4px',
  },

  hintText: {
    fontSize: '12px',
    color: colors.grey,
    fontStyle: 'italic',
  },
}

export default TitleInputBlock