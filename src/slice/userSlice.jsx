import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  authorized: JSON.parse(localStorage.getItem("isAuthorizedUser")) ?? false,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    auth: (state, action) => {
      state.authorized = action.payload;
    },
  },
});

export const setUserAuth = (authState) => (dispatch) => {
  dispatch(auth(authState));
  localStorage.setItem("isAuthorizedUser", JSON.stringify(authState));
};

export const { auth } = userSlice.actions;

export default userSlice.reducer;
