import { createSlice } from "@reduxjs/toolkit"

const commentSlice = createSlice({
  name: "comment",
  initialState: {
    pointedComment: 0,
  },
  reducers: {
    pointComment: (state, action) => {
      state.pointedComment = action.payload
    },
  },
})

export const { pointComment } = commentSlice.actions

export default commentSlice
