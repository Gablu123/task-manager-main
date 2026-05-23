import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../firebase/auth";

export const loadUser = createAsyncThunk("auth/loadUser", async () => {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      resolve(user ? { email: user.email, uid: user.uid } : null);
    });
  });
});

export const signupUser = createAsyncThunk(
  "auth/signup",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      return {
        email: userCred.user.email,
        uid: userCred.user.uid,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const userCred = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      return {
        email: userCred.user.email,
        uid: userCred.user.uid,
      };
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const logoutUser = createAsyncThunk("auth/logout", async () => {
  await signOut(auth);
  return null;
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(loadUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(signupUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export default authSlice.reducer;