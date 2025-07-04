import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface TokensState {
  accessToken: string | null
  email: string | null
}

// Load initial tokens from localStorage
const loadTokens = (): TokensState => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    email: localStorage.getItem('email'),
  }
}

const initialState: TokensState = loadTokens()

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; email: string }>
    ) => {
      state.accessToken = action.payload.accessToken
      state.email = action.payload.email

      // Store in localStorage
      localStorage.setItem('accessToken', action.payload.accessToken)
      localStorage.setItem('email', action.payload.email)
    },
    clearTokens: (state) => {
      state.accessToken = null
      state.email = null

      // Remove from localStorage
      localStorage.removeItem('accessToken')
      localStorage.removeItem('email')
    },
  },
})

// Export actions
export const { setTokens, clearTokens } = tokensSlice.actions
export default tokensSlice.reducer
