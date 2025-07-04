import { CSSProperties } from 'react'
import colors from '../../constants/colors'

export const styles: { [key: string]: CSSProperties } = {
  createModal: {
    maxWidth: '100%',
    height: '100%',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: 10,
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    marginBottom: 10,
    height: 40,
    padding: 10,
    backgroundColor: colors.greyhard,
  },
  button: {
    paddingRight: 20,
    paddingLeft: 20,
    height: '100%',
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 16,
    color: colors.black,
    backgroundColor: colors.yellow,
  },
}
