import { createAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";

const initialState = { session: null, status: "loading" };
const hydrator = createAction(HYDRATE);
const sessionSlice = createSlice({
  name: "localSession",
  initialState,
  reducers: {
    updateSession: (state, action) => {
      state.session = action.payload.session;
      state.status = action.payload.status;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrator, (state, action) => {
        state.session = action.payload;
      })
      .addDefaultCase((state, action) => {});
  },
});

export const sessionReducer = sessionSlice.reducer;

export const { updateSession } = sessionSlice.actions;
