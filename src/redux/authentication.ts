// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** UseJWT import to get config

export const authSlice = createSlice({
  name: 'authentication',
  initialState: {
    token: null,
    sessionid: null,
    userData: {},
    logged: false
  },
  reducers: {
    handleLogin: (state, action) => {
      state.token = action.payload.token
      state.sessionid = action.payload.sessionid
      state.userData = action.payload.userData
      state.logged = true
    },
    handleLogout: (state, action) => {
      state.token = null
      state.sessionid = null
      state.userData = {}
      state.logged = false
    },
    loginState: (state, action) => {
      state.logged = action.payload
      if (!action.payload) {
        state.sessionid = null
        state.token = null
        state.userData = {}
      }
    },
  }
})

export const { handleLogin, handleLogout, loginState } = authSlice.actions

export default authSlice.reducer 