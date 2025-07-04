import { CSSProperties } from 'react'
import colors from '../../constants/colors'

export const styles: {
  container: CSSProperties
  createModal: CSSProperties
  row: CSSProperties
  button: CSSProperties
  modal: {
    content: CSSProperties
  }
} = {
  container: {
    padding: 20,
    backgroundColor: colors.bg,
    height: '100vh',
    flex: 1,
  },
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
    justifyContent: 'space-between',
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
  modal: {
    content: {
      backgroundColor: colors.bg,
      padding: 10,
      width: '90%',
      border: 'none',
      borderRadius: 10,
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  },
}
