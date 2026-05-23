import { Redirect, Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
    >
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
