import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { app } from "./config";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});