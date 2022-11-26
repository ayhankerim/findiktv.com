import { createSlice } from "@reduxjs/toolkit"
import { getSession } from "next-auth/react"

const initialState = {
  user: "",
}

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, props) => {
      state.user = props.payload
    },
  },
})

export const { setUser } = userSlice.actions

export default userSlice.reducer
