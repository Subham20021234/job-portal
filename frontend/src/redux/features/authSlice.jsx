import { createSlice } from "@reduxjs/toolkit";


const safeParseJSON = (item) => {
  try {
    return item ? JSON.parse(item) : null;
  } catch (e) {
    console.warn("Invalid JSON in LocalStorage:", e);
    return null;
  }
};


const savedUser = safeParseJSON(localStorage.getItem("user"));
const savedToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: savedUser,
    token: savedToken || null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
});

export const { setLoading, setUser, setToken, logout } = authSlice.actions;

export default authSlice.reducer;
