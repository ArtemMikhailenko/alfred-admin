import { CSSProperties } from 'react'
import colors from '../../constants/colors'

export const styles: { [key: string]: CSSProperties } = {
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    height: 40,
  },
  input: {
    width: 200,
    height: 40,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 18,
    borderRadius: 8,
    borderWidth: 1,
    flex: 1,
    borderStyle: 'solid',
    borderColor: colors.border,
    backgroundColor: colors.greyhard,
    color: colors.white,
  },
  imagePreview: {
    height: 40,
    objectFit: 'cover',
    borderRadius: 5,
  },
  button: {
    width: 100,
    height: '100%',
    backgroundColor: colors.yellow,
    border: 'none',
    borderRadius: 5,
    cursor: 'pointer',
    fontSize: 16,
    color: colors.black,
  },
}
