// rootReducer.js
import { combineReducers } from "@reduxjs/toolkit";
import authSlide from "./authSlide";

const rootReducer = combineReducers({
  auth: authSlide,
});

export default rootReducer;
