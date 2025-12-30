import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { restoreSession } from "../app/thunks/authThunks";


/* =======================
   Types
======================= */

export interface User {
  _id: string;
  email: string;
  role: "admin" | "teacher" | "student";
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/* =======================
   Initial State
======================= */

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true // important for session restore
};

/* =======================
   Slice
======================= */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Called immediately after successful login
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    // Called on logout
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
    }
  },

  extraReducers: builder => {
    builder
      // Restore session (page reload)
      .addCase(restoreSession.pending, state => {
        state.isLoading = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(restoreSession.rejected, state => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      });
  }
});

/* =======================
   Exports
======================= */

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
