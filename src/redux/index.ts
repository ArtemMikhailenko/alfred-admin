import { configureStore } from '@reduxjs/toolkit'
import tokensReducer from './tokens'

export const store = configureStore({
  reducer: {
    tokens: tokensReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
