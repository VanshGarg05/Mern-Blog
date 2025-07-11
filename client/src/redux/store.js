import { configureStore,combineReducers } from '@reduxjs/toolkit'
import userReducer from "./user/userSlice.js"
import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage"
import themeReducer from "./theme/themeSlice.js"

const rootReducer = combineReducers({
  user: userReducer,
  theme:themeReducer,
})

const persistConfig= {
  key:'root',
  storage,
  version:1
}

const persistedUser = persistReducer(persistConfig,rootReducer)

export const store = configureStore({
  reducer: persistedUser,
  middleware:(getDefaultMiddleware)=> getDefaultMiddleware(
    {serializableCheck:false}
  )
})


export const persistor = persistStore(store)