import api from "../../api/axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const restoreSession = createAsyncThunk(
    "auth/restoreSession",
    async (_, { rejectWithValue }) => {
      try {
        const res = await api.get("/auth/me");
        return res.data.user;
      } catch {
        return rejectWithValue(null);
      }
    }
  );
  