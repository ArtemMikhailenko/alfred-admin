import { JSX } from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { RootState } from '../redux'

interface Props {
  element: JSX.Element
}

const PrivateRoute = ({ element }: Props) => {
  const accessToken = useSelector(
    (state: RootState) => state.tokens.accessToken
  )
  return accessToken ? element : <Navigate to="/login" replace />
}

export default PrivateRoute
