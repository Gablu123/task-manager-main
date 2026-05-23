import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { Provider, useDispatch, useSelector } from "react-redux";
import { store } from "../src/store/store";

import { initDB } from "../src/db/database";
import { useEffect } from "react";
import { loadUser } from "@/src/features/auth/authSlice";

import { View, ActivityIndicator } from "react-native";
import { loadTheme } from "@/src/features/theme/themeSlice";

function RootNavigation() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, []);


  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="index" />
      ) : (
        <Stack.Screen name="(protected)" />
      )}
    </Stack>
  );
}

function AppContent() {
  
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadTheme());
  }, []);

  const mode = useSelector((state) => state.theme.mode);

  return (
    <ThemeProvider value={mode === "dark" ? DarkTheme : DefaultTheme}>
      <RootNavigation />
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
    </ThemeProvider>
  );
}
export default function RootLayout() {
  useEffect(() => {
    initDB();
  }, []);

  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}
