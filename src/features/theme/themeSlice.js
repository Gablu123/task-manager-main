import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const loadTheme = createAsyncThunk("theme/load", async () => {
  const stored = await AsyncStorage.getItem("theme");
  return stored || "light";
});

const saveTheme = async (mode) => {
  await AsyncStorage.setItem("theme", mode);
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    mode: "light",
  },
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";

      saveTheme(state.mode);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadTheme.fulfilled, (state, action) => {
      state.mode = action.payload;
    });
  },
});

export const { toggleTheme } = themeSlice.actions;
export default themeSlice.reducer;