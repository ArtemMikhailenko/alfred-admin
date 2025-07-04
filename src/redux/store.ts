import { configureStore } from '@reduxjs/toolkit'
import tokensReducer from './tokens'

export const store = configureStore({
  reducer: {
    tokens: tokensReducer,
  },
})
