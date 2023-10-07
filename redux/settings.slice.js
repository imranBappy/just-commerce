import { createAction, createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import data from "~/data";

const initialState = { settingsData: data.settings };
const hydrator = createAction(HYDRATE);
const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    updateSettings: (state, action) => {
      state.settingsData = action.payload
        ? action.payload
        : initialState.settingsData;
      state.settingsData.loaded = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(hydrator, (state, action) => {
        state.settingsData = action.payload;
      })
      .addDefaultCase((state, action) => {});
  },
});

export const settingsReducer = settingsSlice.reducer;

export const { updateSettings } = settingsSlice.actions;
