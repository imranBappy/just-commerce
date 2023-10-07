import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { createWrapper, HYDRATE } from "next-redux-wrapper";
import { cartReducer } from "./cart.slice";
import { sessionReducer } from "./session.slice";
import { settingsReducer } from "./settings.slice";

const combinedReducer = combineReducers({
  cart: cartReducer,
  settings: settingsReducer,
  localSession: sessionReducer,
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = { ...state };
    nextState.settings = action.payload.settings;
    return nextState;
  } else {
    return combinedReducer(state, action);
  }
};

export const makeStore = () =>
  configureStore({
    reducer,
    devTools: process.env.NODE_ENV === "development" ? true : false,
  });

export const wrapper = createWrapper(makeStore);
