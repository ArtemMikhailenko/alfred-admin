import { CSSProperties } from 'react'
import colors from '../../constants/colors'

export const styles: { [key: string]: CSSProperties } = {
  // Основной контейнер
  container: {
    display: 'flex',
    flexDirection: 'column',
    maxHeight: '100vh',
    backgroundColor: colors.greyhard,
    borderRadius: '12px',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
  },

  // Секция заголовка
  headerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flexShrink: 0,
    padding: '16px 16px 0 16px',
  },

  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },

  sectionTitle: {
    fontSize: '20px',
    fontWeight: '700',
    color: colors.white,
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    letterSpacing: '-0.02em',
  },

  titleIcon: {
    fontSize: '20px',
  },

  // Кнопка создания квиза
  createButton: {
    height: '40px',
    padding: '0 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: colors.yellow,
    color: colors.black,
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: `0 2px 8px ${colors.yellow}30`,
  },

  // Контейнер редактора
  editorContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '8px',
    backgroundColor: colors.bg,
    borderRadius: '10px',
    border: `1px solid ${colors.border}`,
    flex: 1,
    minHeight: 0,
    maxHeight: 'calc(100vh - 200px)',
    overflowY: 'auto',
  },

  editorHeader: {
    borderBottom: `1px solid ${colors.border}`,
    paddingBottom: '12px',
    flexShrink: 0,
  },

  editorTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: colors.white,
    margin: 0,
  },

  languageSection: {
    display: 'flex',
    justifyContent: 'flex-start',
    flexShrink: 0,
  },

  // Группа ввода
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flexShrink: 0,
  },

  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: colors.grey,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  labelIcon: {
    fontSize: '16px',
  },

  // Поле ввода заголовка
  titleInput: {
    height: '44px',
    padding: '0 12px',
    borderRadius: '10px',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.greyhard,
    color: colors.white,
    fontSize: '16px',
    fontWeight: '600',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Секция вариантов ответов
  optionsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: 1,
    minHeight: 0,
  },

  optionRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexShrink: 0,
  },

  // Кнопка правильного ответа
  correctButton: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: '2px solid',
    cursor: 'pointer',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
  },

  // Поле ввода варианта ответа
  optionInput: {
    flex: 1,
    height: '40px',
    padding: '0 12px',
    borderRadius: '10px',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.greyhard,
    color: colors.white,
    fontSize: '14px',
    fontWeight: '500',
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Кнопка удаления варианта
  deleteOptionButton: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.greyhard,
    color: colors.white,
    cursor: 'pointer',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
  },

  // Секция действий
  actionSection: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    paddingTop: '12px',
    borderTop: `1px solid ${colors.border}`,
    flexShrink: 0,
    marginTop: 'auto',
  },

  // Кнопка добавления варианта
  addOptionButton: {
    height: '44px',
    padding: '0 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: colors.yellow + 'aa',
    color: colors.black,
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  saveActions: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
  },

  // Кнопка сохранения
  saveButton: {
    height: '40px',
    padding: '0 20px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: colors.green + 'dd',
    color: colors.white,
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Кнопка отмены
  cancelButton: {
    height: '40px',
    padding: '0 20px',
    borderRadius: '10px',
    border: `2px solid ${colors.border}`,
    backgroundColor: colors.greyhard,
    color: colors.white,
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },

  buttonIcon: {
    fontSize: '16px',
  },

  // Текст подсказки
  helpText: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    padding: '12px',
    backgroundColor: colors.yellow + '10',
    borderRadius: '10px',
    border: `1px solid ${colors.yellow}30`,
    flexShrink: 0,
  },

  helpIcon: {
    fontSize: '16px',
    marginTop: '1px',
  },

  helpMessage: {
    fontSize: '13px',
    color: colors.grey,
    margin: 0,
    lineHeight: '1.3',
  },

  // Список квизов
  quizList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '16px',
    flex: 1,
    minHeight: 0,
    maxHeight: 'calc(100vh - 160px)',
    overflowY: 'auto',
  },

  // Карточка квиза
  quizCard: {
    padding: '16px',
    backgroundColor: colors.bg,
    borderRadius: '10px',
    border: `1px solid ${colors.border}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    flexShrink: 0,
  },

  quizHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px',
  },

  quizNumber: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    backgroundColor: colors.yellow,
    color: colors.black,
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  quizTitle: {
    flex: 1,
    fontSize: '15px',
    fontWeight: '600',
    color: colors.white,
    margin: 0,
    lineHeight: '1.3',
    wordBreak: 'break-word',
  },

  quizActions: {
    display: 'flex',
    gap: '8px',
    flexShrink: 0,
  },

  // Кнопка редактирования
  editButton: {
    height: '32px',
    padding: '0 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: colors.yellow + 'aa',
    color: colors.white,
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
  },

  // Кнопка удаления
  deleteButton: {
    height: '32px',
    padding: '0 12px',
    borderRadius: '6px',
    border: 'none',
    backgroundColor: colors.red + 'dd',
    color: colors.white,
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    whiteSpace: 'nowrap',
  },

  // Список вариантов ответов
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },

  optionPreview: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '6px 10px',
    backgroundColor: colors.greyhard,
    borderRadius: '6px',
  },

  optionStatus: {
    fontSize: '14px',
    flexShrink: 0,
  },

  optionText: {
    fontSize: '13px',
    color: colors.white,
    lineHeight: '1.2',
    wordBreak: 'break-word',
  },

  // Устаревшие стили для обратной совместимости
  column: {
    width: '100%',
    position: 'inherit',
    height: '100%',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    marginBottom: 10,
  },

  scroll: {
    flexDirection: 'column',
    display: 'flex',
    gap: 10,
  },

  row: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  quizItem: {
    width: '100%',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    borderRadius: 8,
    padding: 10,
    gap: 5,
    display: 'flex',
    boxSizing: 'border-box',
    flexDirection: 'column',
  },

  localLanguageButton: {
    paddingRight: 20,
    paddingLeft: 20,
    height: 40,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 16,
    color: colors.black,
    backgroundColor: colors.red,
    marginRight: 10,
    marginBottom: 10,
  },

  quizItemTitle: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
    margin: 0,
    marginBottom: 10,
    flex: 1,
  },

  quizItemButton: {
    fontSize: 18,
    color: colors.white,
    margin: 0,
  },

  quizEditor: {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    padding: 10,
    borderRadius: 8,
  },

  input: {
    height: 40,
    width: '100%',
    boxSizing: 'border-box',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    border: '1px solid ' + colors.border,
    backgroundColor: colors.greyhard,
    color: colors.white,
  },

  answerButton: {
    height: 40,
    width: 40,
    borderRadius: 5,
    backgroundColor: colors.greyhard,
    border: '1px solid ' + colors.border,
    cursor: 'pointer',
  },

  addButton: {
    height: 40,
    width: 100,
    backgroundColor: colors.white,
    color: colors.black,
    fontSize: 16,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
}