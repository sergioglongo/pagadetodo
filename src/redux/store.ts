import rootReducer from './rootReducer'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { apiQueries, apiToken } from '../services/apiQueries'

const store = configureStore({
  reducer: {...rootReducer, 
    [apiQueries.reducerPath]: apiQueries.reducer,
    [apiToken.reducerPath]: apiToken.reducer
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware({
      serializableCheck: false
    }).concat(apiQueries.middleware).concat(apiToken.middleware)
  }
})

setupListeners(store.dispatch)

export { store } 