import { createSlice } from "@reduxjs/toolkit"

const clientSlice = createSlice({
  name: "client",
  initialState: {
    ipAddress: "",
  },
  reducers: {
    getClientIp: (state, action) => {
      state.ipAddress = action.payload
    },
  },
})

export const { getClientIp } = clientSlice.actions

export default clientSlice
