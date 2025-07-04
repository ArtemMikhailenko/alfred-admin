import { CSSProperties } from 'react'
import colors from './colors'
const globalStyles: { [key: string]: CSSProperties } = {
  rowBetween: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
  },
  rowStart: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 10,
  },
  // INPUTS
  oneLineInput: {
    flex: 1,
    maxHeight: 40,
    height: 40,
    padding: 10,
    fontSize: 18,
    borderRadius: 5,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.greyhard,
    color: colors.white,
  },
  // BUTTONS
  cancelButton: {
    height: 40,
    width: 100,
    backgroundColor: 'transparent',
    color: colors.red,
    fontSize: 16,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  editButton: {
    height: 40,
    width: 100,
    backgroundColor: colors.grey,
    color: colors.black,
    fontSize: 16,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },
  submitButton: {
    height: 40,
    width: 100,
    backgroundColor: colors.yellow,
    color: colors.black,
    fontSize: 16,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
  },

  // TEXT
  title: {
    fontSize: 20,
    color: colors.white,
    margin: 0,
  },
  titleFlex: {
    flex: 1,
    textAlign: 'left',
    fontSize: 20,
    color: colors.white,
    margin: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  comment: {
    fontSize: 16,
    color: colors.grey,
    margin: 0,
  },
  // ITEMS
  item: {
    height: 50,
    boxSizing: 'border-box',
    padding: 5,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.greyhard,
    borderRadius: 10,
    marginBottom: 10,
    gap: 10,
  },
}

export default globalStyles
