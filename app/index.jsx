import { Pressable, StyleSheet, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; 

import ThemeView from "../components/ThemeView";
import ThemeText from "../components/ThemeText";
import { useSelector } from "react-redux";

const Index = () => {
  const router = useRouter();
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <ThemeView style={styles.container}>
      
      <View style={styles.heroSection}>
        <View 
          style={[
            styles.iconWrapper,
            { backgroundColor: isDark ? "rgba(10, 132, 255, 0.1)" : "rgba(0, 122, 255, 0.08)" }
          ]}
        >
          <Ionicons 
            name="checkbox" 
            size={48} 
            color={isDark ? "#0A84FF" : "#007AFF"} 
          />
        </View>
        
        <ThemeText style={styles.title}>Task Manager</ThemeText>
        <ThemeText style={styles.subtitle}>
          Organize your daily tasks, hit goals, and stay productive efficiently.
        </ThemeText>
      </View>

      <View style={styles.actionSection}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            { 
              backgroundColor: isDark ? "#0A84FF" : "#007AFF",
              opacity: pressed ? 0.85 : 1 
            },
          ]}
          onPress={() => router.push("/signin")}
        >
          <ThemeText style={styles.primaryButtonText}>Sign In</ThemeText>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.secondaryButton,
            { 
              borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.1)",
              backgroundColor: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
              opacity: pressed ? 0.7 : 1 
            }
          ]}
          onPress={() => router.push("/signup")}
        >
          <ThemeText
            style={[
              styles.secondaryButtonText,
              { color: isDark ? "#4DA3FF" : "#007AFF" },
            ]}
          >
            Create Account
          </ThemeText>
        </Pressable>
        
      </View>
    </ThemeView>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between", 
  },
  heroSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 40,
  },
  iconWrapper: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(150, 150, 150, 0.1)",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.5,
    textAlign: "center",
    paddingHorizontal: 20,
    fontWeight: "500",
  },
  actionSection: {
    width: "100%",
    gap: 14,
    marginBottom: 50, 
  },
  primaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
  },
  secondaryButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
  },
  secondaryButtonText: {
    fontSize: 17,
    fontWeight: "600",
  },
});