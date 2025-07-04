import { AdminLogin } from '../actions/actions'
import { setTokens } from '../redux/tokens'
import { promptPassword } from '../screens/SwipeTradeScreen'

type RetryCallback = (accessToken: string) => Promise<boolean>

export async function ReloginAndRetry(
  email: string,
  dispatch: (action: any) => void,
  retry: RetryCallback
): Promise<void> {
  const password = await promptPassword()
  if (!password) return

  const loginResponse = await AdminLogin(email, password)
  if (!loginResponse.access_token) {
    alert('Login failed. Please try again.')
    return
  }

  dispatch(
    setTokens({
      accessToken: loginResponse.access_token,
      email,
    })
  )

  const success = await retry(loginResponse.access_token)
  if (!success) {
    alert('Failed even after re-login.')
  }
}
